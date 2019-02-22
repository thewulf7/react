import * as React from 'react'

import useEventListener from './lib/useEventListener'
import { EventListenerProps } from './types'

const EventListener: React.FC<EventListenerProps> = props => {
  useEventListener(props)
  return null
}

export default EventListener
