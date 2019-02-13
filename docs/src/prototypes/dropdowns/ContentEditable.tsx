import * as React from 'react'
import * as PropTypes from 'prop-types'
import * as _ from 'lodash'

import { replaceCaret } from './utils'
import { Extendable } from 'src/types'

type EventHandler = (e: React.SyntheticEvent<HTMLElement>) => void

export interface SimpleContentEditableProps {
  html?: string
  onChange?: EventHandler
  onBlur?: EventHandler
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void
}

export class SimpleContentEditable extends React.Component<Extendable<SimpleContentEditableProps>> {
  private lastHtml: string = this.props.html
  private ref = React.createRef<HTMLDivElement>()

  static propTypes = {
    html: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
  }

  render() {
    const { children, html, ...props } = this.props

    return (
      <div
        {...props}
        contentEditable
        dangerouslySetInnerHTML={{ __html: html }}
        ref={this.ref}
        onInput={e => this.handleEvent(e, 'onInput')}
        onBlur={e => this.handleEvent(e, 'onBlur')}
        onKeyDown={e => this.handleEvent(e, 'onKeyDown')}
        onKeyUp={e => this.handleEvent(e, 'onKeyUp')}
      >
        {children}
      </div>
    )
  }

  shouldComponentUpdate(): boolean {
    return false
  }

  private handleEvent = (event: React.SyntheticEvent<HTMLElement>, eventName: string) => {
    _.invoke(this.props, eventName, event, this.props)
    this.emitChange(event)
  }

  private emitChange = (event: React.SyntheticEvent<HTMLElement>) => {
    if (!this.ref) {
      return
    }

    const html = this.ref.current.innerHTML
    if (this.props.onChange && html !== this.lastHtml) {
      this.props.onChange(Object.assign({}, event, { target: { value: html } }))
    }

    this.lastHtml = html
  }
}

export interface ContentEditableProps {
  html?: string
  onChange?: EventHandler
  onBlur?: EventHandler
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void
  disabled?: boolean
  as?: string
  innerRef?: React.RefObject<HTMLElement> | Function
}

/**
 * A simple component for an html element with editable contents.
 */
class ContentEditable extends React.Component<Extendable<ContentEditableProps>> {
  private lastHtml: string = this.props.html
  private element: React.RefObject<HTMLElement> =
    typeof this.props.innerRef === 'function' ? { current: null } : React.createRef<HTMLElement>()

  private getEl = () =>
    (this.props.innerRef && typeof this.props.innerRef !== 'function'
      ? this.props.innerRef
      : this.element
    ).current

  static propTypes = {
    html: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    disabled: PropTypes.bool,
    as: PropTypes.string,
    innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  }

  static defaultProps: ContentEditableProps = {
    as: 'div',
  }

  render() {
    const { as, html, innerRef, ...props } = this.props

    return React.createElement(
      as || 'div',
      {
        ...props,
        ref:
          typeof innerRef === 'function'
            ? (current: HTMLElement) => {
                innerRef(current)
                ; (this.element as any).current = current
              }
            : innerRef || this.element,
        onInput: this.emitChange,
        onBlur: this.props.onBlur || this.emitChange,
        onKeyDown: this.props.onKeyDown || this.emitChange,
        contentEditable: !this.props.disabled,
        dangerouslySetInnerHTML: { __html: html },
      },
      this.props.children,
    )
  }

  shouldComponentUpdate(nextProps: ContentEditableProps): boolean {
    const props = this.props
    const el = this.getEl()
    if (!el) return true

    // ...or if html really changed... (programmatically, not by user edit)
    // if (normalizeHtml(nextProps.html) !== normalizeHtml(el.innerHTML)) {
    //   return true
    // }

    // Handle additional properties
    const should =
      props.disabled !== nextProps.disabled ||
      props.as !== nextProps.as ||
      props.innerRef !== nextProps.innerRef

    return should
  }

  componentDidUpdate() {
    const el = this.getEl()
    if (!el) return
    if (this.props.html !== el.innerHTML) {
      el.innerHTML = this.lastHtml = this.props.html
    }
    replaceCaret(el)
  }

  private emitChange = (originalEvt: React.SyntheticEvent<HTMLElement>) => {
    const el = this.getEl()
    if (!el) return

    const html = el.innerHTML
    if (this.props.onChange && html !== this.lastHtml) {
      // Clone event with Object.assign to avoid
      // "Cannot assign to read only property 'target' of object"
      const evt = Object.assign({}, originalEvt, { target: { value: html } })
      this.props.onChange(evt)
    }
    this.lastHtml = html
  }
}

export default ContentEditable
