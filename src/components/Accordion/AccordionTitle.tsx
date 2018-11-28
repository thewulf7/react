import * as _ from 'lodash'
import * as PropTypes from 'prop-types'
import * as React from 'react'

import { childrenExist, createShorthandFactory, UIComponent, customPropTypes } from '../../lib'
import { Extendable, ComponentEventHandler, ShorthandValue } from '../../../types/utils'
import {
  UIComponentProps,
  ContentComponentProps,
  ChildrenComponentProps,
} from '../../lib/commonPropInterfaces'
import {
  commonUIComponentPropTypes,
  childrenComponentPropTypes,
  contentComponentPropsTypes,
} from '../../lib/commonPropTypes'
import Icon from '../Icon/Icon'

export interface AccordionTitleProps
  extends UIComponentProps<any, any>,
    ContentComponentProps,
    ChildrenComponentProps {
  /** Whether or not the title is in the open state. */
  active?: boolean

  /** Shorthand of props for opened and closed icons. */
  icons?: {
    opened: ShorthandValue
    closed: ShorthandValue
  }

  /** AccordionTitle index inside Accordion. */
  index?: string | number

  /**
   * Called on click.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props.
   */
  onClick?: ComponentEventHandler<AccordionTitleProps>
}

/**
 * A standard AccordionTitle.
 */
class AccordionTitle extends UIComponent<Extendable<AccordionTitleProps>, any> {
  static displayName = 'AccordionTitle'

  static create: Function

  static className = 'ui-accordion__title'

  static propTypes = {
    ...commonUIComponentPropTypes,
    ...childrenComponentPropTypes,
    ...contentComponentPropsTypes,
    active: PropTypes.bool,
    panels: customPropTypes.every([
      customPropTypes.disallow(['children']),
      PropTypes.arrayOf(
        PropTypes.shape({
          opened: customPropTypes.itemShorthand,
          closed: customPropTypes.itemShorthand,
        }),
      ),
    ]),
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClick: PropTypes.func,
  }

  private handleClick = e => {
    _.invoke(this.props, 'onClick', e, this.props)
  }

  renderComponent({ ElementType, classes, rtl, rest }) {
    const {
      active,
      children,
      content,
      icons = {
        opened: 'caret-down-solid',
        closed: rtl ? 'caret-left-solid' : 'caret-right-solid',
      },
    } = this.props

    if (childrenExist(children)) {
      return (
        <ElementType {...rest} className={classes.root} onClick={this.handleClick}>
          {children}
        </ElementType>
      )
    }

    return (
      <ElementType {...rest} className={classes.root} onClick={this.handleClick}>
        {Icon.create(active ? icons.opened : icons.closed)}
        {content}
      </ElementType>
    )
  }
}

AccordionTitle.create = createShorthandFactory(AccordionTitle, 'content')

export default AccordionTitle
