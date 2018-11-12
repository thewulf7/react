export type TState<State> = { [key: string]: any } & State

export interface IActions<State, Actions> {
  [key: string]: TAction<State, Actions>
  init: TAction<State, Actions>
}

export type TAction<State, Actions> = (
  ...args: any[]
) => (state: TState<State>, actions: IActions<State, Actions> & Actions) => TState<State>

export type TMiddleWareFunc<State, Actions> = (
  prevState: TState<State>,
  nextState: TState<State>,
  actions: Actions,
) => TState<State> | void

export interface IManagerConfig<State, Actions> {
  debug?: boolean
  state?: TState<State>
  actions: IActions<State, Actions> & Actions
  middleware?: TMiddleWareFunc<State, Actions>[]
  sideEffects?: ((manager: IManagerAPI<State, Actions>, next: Function) => any)[]
}

export interface IManagerAPI<State, Actions> {
  readonly state: TState<State>
  actions: { [actionName in keyof IActions<State, Actions> | 'init']: (...args: any[]) => void }
}

const assign = Object.assign
const clone = (object: any) => assign({}, object)

const createManager = <State, Actions>(
  config: IManagerConfig<State, Actions>,
): IManagerAPI<State, Actions> => {
  const { debug, state, actions, middleware, sideEffects } = config
  const _state: State = clone(state)
  const getState = (): State => clone(_state)
  const setState = (partial: Partial<State> | void): State => assign(_state, partial)

  const manager: IManagerAPI<State, Actions> = {
    actions: {},
    get state() {
      return getState()
    },
  }

  // assign actions to manager's api
  Object.keys(actions).forEach((actionName: keyof IActions<State, Actions>) => {
    manager.actions[actionName] = (...args) => {
      applyAction(actions[actionName], ...args)
      applyMiddleware()
      applySideEffects()
    }
    // always have an init action to set state
    manager.actions.init = () => (state: State) => state
  })

  const applyAction = (action: TAction<State, Actions>, ...args: any[]) => {
    if (!action) return

    if (debug) console.log('manager ACTION', action.name || 'Anonymous')
    setState(action(...args)(manager.state, actions))
  }

  const applyMiddleware = () => {
    if (!middleware) return

    const prevState = getState()

    middleware.forEach((fn, index) => {
      if (debug) {
        console.log(`manager MIDDLEWARE[${index}]`, {
          prev: prevState,
          next: getState(),
        })
      }
      setState(fn(prevState, getState(), actions))
    })
  }

  const applySideEffects = (done?: () => void) => {
    if (!sideEffects) return

    let index = -1
    const next = () => {
      index++
      if (index === sideEffects.length) {
        if (debug) console.log('manager FINISHED', getState())
        if (done) done()
        return
      }

      const sideEffect = sideEffects[index]

      if (debug) console.log(`manager SIDE_EFFECT[${index}]`)
      sideEffect(manager, next)
    }

    next()
  }

  return manager
}

export default createManager
