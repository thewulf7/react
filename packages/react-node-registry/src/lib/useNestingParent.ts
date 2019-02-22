import * as React from 'react'

import NestingContext from '../NestingContext'

const useNestingParent = () => {
  const [registry] = React.useState(new Set())
  const parentRef = React.useRef()

  const getNodes = React.useCallback(() => {
    return [...registry]
  }, [])
  const register = React.useCallback((node: HTMLElement) => {
    registry.add(node)
  }, [])
  const unregister = React.useCallback((node: HTMLElement) => {
    registry.delete(node)
  }, [])

  const context = React.useMemo(
    () => ({
      getNodes,
      register,
      unregister,
    }),
    [],
  )

  React.useEffect(() => {
    register(parentRef)

    return () => {
      unregister(parentRef)
    }
  }, [])

  return {
    Component: NestingContext.Provider,
    getNodes,
    props: { value: context },
    ref: parentRef,
  }
}

export default useNestingParent
