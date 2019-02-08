import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as _ from 'lodash'
import keyboardKey from 'keyboard-key'
import { Provider, Box, Dropdown, themes } from '@stardust-ui/react'

import ContentEditable from './ContentEditable'
import { atMentionItems } from './dataMocks'
import { createNodeWithIdAtCaretPosition } from './utils'

interface InputWithDropdownState {
  dropdownOpen?: boolean
  inputValue?: any
}

class InputWithDropdownExample extends React.Component<{}, InputWithDropdownState> {
  private readonly mountNodeId = 'dropdown-mount-node'
  private contentEditableRef = React.createRef<HTMLDivElement>()

  public state: InputWithDropdownState = {
    dropdownOpen: false,
    inputValue: 'Test initial input value',
  }

  render() {
    return (
      <Box
        styles={({ theme: { siteVariables } }) => ({
          backgroundColor: siteVariables.gray10,
          padding: '10px',
        })}
      >
        <ContentEditable
          innerRef={this.contentEditableRef}
          html={this.state.inputValue}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onKeyUp={() => this.logCaretPosition('onKeyUp')}
          onClick={() => this.logCaretPosition('onClick')}
          onFocus={() => this.logCaretPosition('onFocus')}
        />
      </Box>
    )
  }

  private handleChange = (e: React.SyntheticEvent<HTMLElement>) => {
    const html = _.get(e, 'target.value')
    console.log('handleChange html: ', html)
    this.logCaretPosition('handleChange')

    this.setState({ inputValue: html })
  }

  private handleKeyDown = (e: React.KeyboardEvent) => {
    this.logCaretPosition('handleKeyDown')
    const code = keyboardKey.getCode(e)
    switch (code) {
      case keyboardKey.AtSign: // @
        // this.setState({ dropdownOpen: true })
        this.showDropdown()
        this.setState({ dropdownOpen: true })
        break
      case keyboardKey.Escape: // 27
        this.hideDropdown()
        this.setState({ dropdownOpen: false })
        // this.setState({ dropdownOpen: false })
        break
    }
  }

  private showDropdown = () => {
    createNodeWithIdAtCaretPosition(this.mountNodeId)

    const node = this.getMountNode()
    ReactDOM.render(
      <Provider theme={themes.teams}>
        <Dropdown
          inline
          search
          items={atMentionItems}
          toggleIndicator={null}
          noResultsMessage="We couldn't find any matches."
        />
      </Provider>,
      node,
    )
  }

  private hideDropdown = () => {
    // TODO: find and destroy element with id this.mountNodeId
    ReactDOM.unmountComponentAtNode(this.getMountNode())
  }

  private getMountNode = () => document.getElementById(this.mountNodeId)

  private logCaretPosition = (source: string) => {
    console.log('CARET FROM ', source, 'is: ', getCaretPosition(this.contentEditableRef.current))
  }
}

function getCaretPosition(editableDiv: HTMLElement) {
  let caretPos = 0

  const sel = window.getSelection && window.getSelection()
  if (!sel || !sel.rangeCount) {
    return caretPos
  }

  const range = sel.getRangeAt(0)
  if (range.commonAncestorContainer.parentNode === editableDiv) {
    caretPos = range.endOffset
  }

  return caretPos
}

export default InputWithDropdownExample
