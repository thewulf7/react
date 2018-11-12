import createManager, { IManagerConfig, TAction } from './createManager'

interface IPopupState {
  open?: boolean
  target?: HTMLElement
}

interface IPopupActions {
  open: TAction<IPopupState, IPopupActions>
  close: TAction<IPopupState, IPopupActions>
  toggle: TAction<IPopupState, IPopupActions>
}

const createPopupManager = (
  config: Partial<IManagerConfig<Partial<IPopupState>, Partial<IPopupActions>>> = {},
) =>
  createManager<IPopupState, IPopupActions>({
    ...config,
    state: {
      open: false,
      ...config.state,
    },

    actions: {
      open: () => () => ({ open: true }),

      close: () => () => ({ open: false }),

      toggle: () => (state, actions) => {
        if (state.open) {
          return actions.close()(state, actions)
        }
        return actions.open()(state, actions)
      },
      ...config.actions,
    },
  })

export default createPopupManager
