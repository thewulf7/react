import * as React from 'react'

import useStackableEventListener from './lib/useStackableEventListener'
import { EventListenerProps } from './types'

const StackableEventListener: React.FC<EventListenerProps> = props => {
  useStackableEventListener(props)
  return null
}

export default StackableEventListener
