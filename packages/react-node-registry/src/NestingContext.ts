import * as React from 'react'

export type NestingContextValue = {
  register: () => void
  unregister: () => void
}

const NestingContext = React.createContext(false)

export default NestingContext
