import * as React from 'react'
import * as _ from 'lodash'
import * as PropTypes from 'prop-types'

import { replaceCaret } from './utils'
import { Extendable } from 'src/types'

type EventHandler = (e: React.SyntheticEvent<HTMLElement>) => void

export interface Props {
  html?: string
  onChange?: EventHandler
  onBlur?: EventHandler
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void
  disabled?: boolean
  tagName?: string
  className?: string
  style?: Object
  innerRef?: React.RefObject<HTMLElement> | Function
}

/**
 * A simple component for an html element with editable contents.
 */
class ContentEditable extends React.Component<Extendable<Props>> {
  private lastHtml: string = this.props.html
  private el: React.RefObject<HTMLElement> =
    typeof this.props.innerRef === 'function' ? { current: null } : React.createRef<HTMLElement>()

  private getEl = () =>
    (this.props.innerRef && typeof this.props.innerRef !== 'function'
      ? this.props.innerRef
      : this.el
    ).current

  static propTypes = {
    html: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    disabled: PropTypes.bool,
    tagName: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  }

  render() {
    const { tagName, html, innerRef, ...props } = this.props

    return React.createElement(
      tagName || 'div',
      {
        ...props,
        ref:
          typeof innerRef === 'function'
            ? (current: HTMLElement) => {
                innerRef(current)
                ; (this.el as any).current = current
              }
            : innerRef || this.el,
        onInput: this.emitChange,
        onBlur: this.props.onBlur || this.emitChange,
        onKeyDown: this.props.onKeyDown || this.emitChange,
        contentEditable: !this.props.disabled,
        dangerouslySetInnerHTML: { __html: html },
      },
      this.props.children,
    )
  }

  shouldComponentUpdate(nextProps: Props): boolean {
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
      props.tagName !== nextProps.tagName ||
      props.className !== nextProps.className ||
      props.innerRef !== nextProps.innerRef ||
      !_.isEqual(props.style, nextProps.style)

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
