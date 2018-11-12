import * as React from 'react'
import { createPortal } from 'react-dom'
import * as PropTypes from 'prop-types'
import _ from 'lodash'
import { Popper, PopperChildrenProps } from 'react-popper'

import {
  childrenExist,
  customPropTypes,
  EventStack,
  isBrowser,
  RenderResultConfig,
  UIComponent,
} from '../../lib'
import {
  ComponentEventHandler,
  Extendable,
  ReactChildren,
  ShorthandValue,
} from '../../../types/utils'

import Ref from '../Ref/Ref'
import computePopupPlacement, { Alignment, Position } from './positioningHelper'

import PopupContent from './PopupContent'

import { popupBehavior } from '../../lib/accessibility'
import {
  Accessibility,
  AccessibilityActionHandlers,
  AccessibilityBehavior,
} from '../../lib/accessibility/types'
import createPopupManager from '../../../state/createPopupManager'

const POSITIONS: Position[] = ['above', 'below', 'before', 'after']
const ALIGNMENTS: Alignment[] = ['top', 'bottom', 'start', 'end', 'center']

export interface PopupProps {
  accessibility?: Accessibility
  align?: Alignment
  children?: ReactChildren
  className?: string
  content?: ShorthandValue
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: ComponentEventHandler<PopupProps>
  position?: Position
  target?: HTMLElement
  defaultTarget?: HTMLElement
  trigger?: JSX.Element
}

export interface PopupState {
  open?: boolean
  target?: HTMLElement
}

// TODO: notes here on how to make auto controlled updates independent of the instance
// const acProps = []
// const mgr = {}
//
// const acMangerUpdate = (mgr, acProps, props) => {
//   // get curr state
//   // return filtered state (per acProps in props)
// }

const autoControlledMiddleware = ({ autoControlledProps, getProps }) => (prevState, nextState) => {
  const props = getProps()
  // filter out state updates for props that are controlled by the user
  const filteredState = autoControlledProps.reduce((acc, next) => {
    if (props[next] !== undefined) {
      console.log('copying defined prop to state:', {
        propName: next,
        propValue: props[next],
      })
      acc[next] = props[next]
    }

    return acc
  }, nextState)

  console.log('autoControlledMiddleware', {
    autoControlledProps,
    props,
    filteredState,
  })

  return filteredState
}

/**
 * A Popup displays additional information on top of a page.
 * @accessibility This is example usage of the accessibility tag.
 * This should be replaced with the actual description after the PR is merged
 */
export default class Popup extends UIComponent<Extendable<PopupProps>, PopupState> {
  manager = createPopupManager({
    state: { target: null },
    actions: {
      // TODO: fix typings, don't require init from user
      init: () => () => null,

      setTarget: target => () => ({ target }),
    },

    // some action has been called (e.g. actions.open())
    // prevState is state before action was called
    // nextState is state after action was called, but before it was applied
    // actions.open()
    middleware: [
      autoControlledMiddleware({
        autoControlledProps: ['open', 'target'],
        getProps: (props = this.props) => props,
      }),
    ],

    sideEffects: [
      // TODO: provide common state middleware
      // TODO: in the /react package? setState() middleware is a React binding...
      (manager, next) => {
        this.setState(manager.state)

        next()
      },
    ],
  })

  public static displayName = 'Popup'

  public static className = 'ui-popup'

  public static Content = PopupContent

  public static propTypes = {
    /** Accessibility behavior if overridden by the user. */
    accessibility: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),

    /** Alignment for the popup. */
    align: PropTypes.oneOf(ALIGNMENTS),

    /**
     *  Used to set content when using childrenApi - internal only
     *  @docSiteIgnore
     */
    children: PropTypes.node,

    /** Additional CSS class name(s) to apply.  */
    className: PropTypes.string,

    /** The popup content. */
    content: customPropTypes.itemShorthand,

    /** Initial value for 'open'. */
    defaultOpen: PropTypes.bool,

    /** Initial value for 'target'. */
    defaultTarget: PropTypes.any,

    /** Defines whether popup is displayed. */
    open: PropTypes.bool,

    /**
     * Event for request to change 'open' value.
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props and proposed value.
     */
    onOpenChange: PropTypes.func,

    /**
     * Position for the popup. Position has higher priority than align. If position is vertical ('above' | 'below')
     * and align is also vertical ('top' | 'bottom') or if both position and align are horizontal ('before' | 'after'
     * and 'start' | 'end' respectively), then provided value for 'align' will be ignored and 'center' will be used instead.
     */
    position: PropTypes.oneOf(POSITIONS),

    /**
     * DOM element that should be used as popup's target - instead of 'trigger' element that is used by default.
     */
    target: PropTypes.any,

    /** Element to be rendered in-place where the popup is defined. */
    trigger: PropTypes.any,
  }

  // TODO: implement defaults for auto controlled values
  public static defaultProps: PopupProps = {
    accessibility: popupBehavior,
    align: 'start',
    position: 'above',
  }

  private static isBrowserContext = isBrowser()

  private outsideClickSubscription = EventStack.noSubscription

  private triggerDomElement = null
  private popupDomElement = null

  protected actionHandlers: AccessibilityActionHandlers = {
    toggle: e => {
      this.trySetOpen(!this.state.open, e)
    },
    closeAndFocusTrigger: e => this.closeAndFocusTrigger(e),
  }

  // TODO
  // TODO: How to allow auto controlling state from "next" props
  // TODO
  // static getDerivedStateFromProps(props, state) {
  //   // allow calling middleware directly :S
  //   // props.manager.middleware[0]({props})
  //
  //   // allow setting / resetting state directly :S
  //   // props.manager.setSomeState(props)
  // }

  private closeAndFocusTrigger = e => {
    console.log('closeAndFocusTrigger')
    this.trySetOpen(false, e)

    // TODO: unsafe, open could change async.  don't assume it is update....
    if (this.state.open) {
      _.invoke(this.triggerDomElement, 'focus')
    }
  }

  private updateOutsideClickSubscription() {
    this.outsideClickSubscription.unsubscribe()

    if (this.state.open) {
      setTimeout(() => {
        console.log('updateOutsideClickSubscription')
        this.outsideClickSubscription = EventStack.subscribe('click', e => {
          if (!this.popupDomElement || !this.popupDomElement.contains(e.target)) {
            this.closeAndFocusTrigger(e)
          }
        })
      })
    }
  }

  public state = {
    target: undefined,
    ...this.manager.state,
  }

  public componentDidMount() {
    this.updateOutsideClickSubscription()

    if (!this.state.open) {
      this.popupDomElement = null
    }
  }

  public componentDidUpdate() {
    this.updateOutsideClickSubscription()

    if (!this.state.open) {
      this.popupDomElement = null
    }
  }

  public componentWillUnmount() {
    this.outsideClickSubscription.unsubscribe()
  }

  public renderComponent({ rtl, accessibility }: RenderResultConfig<PopupProps>): React.ReactNode {
    const popupContent = this.renderPopupContent(rtl, accessibility)
    console.log('POPUP state.open', this.state.open)
    console.log('POPUP props.open', this.props.open)

    return (
      <>
        {this.renderTrigger(accessibility)}

        {this.state.open &&
          Popup.isBrowserContext &&
          popupContent &&
          createPortal(popupContent, document.body)}
      </>
    )
  }

  private renderTrigger(accessibility) {
    const { children, trigger } = this.props
    const triggerElement = childrenExist(children) ? children : (trigger as any)

    return (
      triggerElement && (
        <Ref
          innerRef={domNode => {
            this.manager.actions.setTarget(domNode)
            // TODO: how to handle this in the state abstraction?
            // this.trySetState({ target: domNode })
            this.triggerDomElement = domNode
          }}
        >
          {React.cloneElement(triggerElement, {
            onClick: e => {
              this.trySetOpen(!this.state.open, e)
              _.invoke(triggerElement, 'props.onClick', e)
            },
            ...accessibility.attributes.trigger,
            ...accessibility.keyHandlers.trigger,
          })}
        </Ref>
      )
    )
  }

  private renderPopupContent(rtl: boolean, accessibility: AccessibilityBehavior): JSX.Element {
    const { align, position } = this.props
    const { target } = this.state

    const placement = computePopupPlacement({ align, position, rtl })

    return (
      target && (
        <Popper
          placement={placement}
          referenceElement={target}
          children={this.renderPopperChildren.bind(this, rtl, accessibility)}
        />
      )
    )
  }

  private renderPopperChildren = (
    rtl: boolean,
    accessibility: AccessibilityBehavior,
    { ref, style: popupPlacementStyles }: PopperChildrenProps,
  ) => {
    const { content } = this.props

    return (
      <Ref
        innerRef={domElement => {
          ref(domElement)
          this.popupDomElement = domElement
        }}
      >
        {Popup.Content.create(content, {
          defaultProps: {
            ...(rtl && { dir: 'rtl' }),
            style: popupPlacementStyles,
            ...accessibility.attributes.popup,
            ...accessibility.keyHandlers.popup,
          },
        })}
      </Ref>
    )
  }

  private trySetOpen(newValue: boolean, eventArgs: any) {
    _.invoke(this.props, 'onOpenChange', eventArgs, {
      ...this.props,
      ...{ open: newValue },
    })

    if (newValue) {
      this.manager.actions.open()
    } else {
      this.manager.actions.close()
    }
  }
}
