import * as React from 'react'
import { EventHandler, EventTypes } from '../types'

type UseListenerHookOptions<N, T extends EventTypes> = {
  on: EventHandler<T>
  target: React.RefObject<N>
  type: T
}

const useEventListener = <N extends HTMLElement, T extends EventTypes>(
  options: UseListenerHookOptions<N, T>,
) => {
  React.useEffect(() => {
    const { on, target, type } = options
    const listener = (event: DocumentEventMap[T]) => {
      on(event)
    }

    target.current.addEventListener(type, listener)

    return () => {
      target.current.removeEventListener(type, listener)
    }
  }, [])
}

export default useEventListener
