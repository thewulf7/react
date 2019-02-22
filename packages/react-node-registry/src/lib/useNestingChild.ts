import * as React from 'react'

import NestingContext from '../NestingContext'

const useNestingChild = () => {
  const nestingContext = React.useContext(NestingContext)
  const childRef = React.useRef()

  const getNodes = React.useCallback(() => {
    const nodes = nestingContext.getNodes()
    const childId = nodes.indexOf(childRef)

    return nodes.slice(childId)
  }, [])

  React.useEffect(() => {
    nestingContext.register(childRef)

    return () => {
      nestingContext.unregister(childRef)
    }
  }, [])

  return { Component: React.Fragment, getNodes, props: null, ref: childRef }
}

export default useNestingChild
