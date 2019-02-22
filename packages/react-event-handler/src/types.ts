import * as React from 'react'

export interface EventListenerProps {
  /* TODO */
  on: EventHandler<'click'>

  /* TODO */
  type: EventTypes

  /* TODO */
  target: React.RefObject<HTMLElement>
}

export type EventHandler<T extends EventTypes> = (e: DocumentEventMap[T]) => void

export type EventTypes = keyof DocumentEventMap

export type UseListenerHookOptions<N, T extends EventTypes> = {
  on: EventHandler<T>
  target: React.RefObject<N>
  type: T
}
