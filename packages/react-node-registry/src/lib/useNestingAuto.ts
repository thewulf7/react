import * as React from 'react'

import NestingContext from '../NestingContext'
import useNestingChild from './useNestingChild'
import useNestingParent from './useNestingParent'

export const useNestingAuto = () => {
  const nestingContext = React.useContext(NestingContext)

  if (nestingContext) {
    return {
      ...useNestingChild(),
      isChild: true,
      isParent: false,
    }
  }

  return {
    ...useNestingParent(),
    isChild: false,
    isParent: true,
  }
}
