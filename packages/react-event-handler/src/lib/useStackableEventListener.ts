import * as React from 'react'

import { EventTypes, UseListenerHookOptions } from '../types'
import ListenerRegistry from './ListenerRegistry'

const listenerRegistry = new ListenerRegistry()

const useEventListener = <N extends HTMLElement, T extends EventTypes>(
  options: UseListenerHookOptions<N, T>,
) => {
  React.useEffect(() => {
    const { on, target, type } = options
    const listener = (event: DocumentEventMap[T]) => {
      if (listenerRegistry.dispatchable(type, on)) {
        on(event)
      }

      return on(event)
    }

    target.current.addEventListener(type, listener)

    return () => {
      target.current.removeEventListener(type, listener)
    }
  }, [])
}

export default useEventListener
