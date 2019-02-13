import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as _ from 'lodash'
import keyboardKey from 'keyboard-key'
import { Provider, Box, Dropdown, themes } from '@stardust-ui/react'

// import ContentEditable from './ContentEditable'
import { SimpleContentEditable } from './ContentEditable'
import { atMentionItems } from './dataMocks'
// import { insertNodeAtCursorPosition } from './utils'
import { insertNodeAtCursorPositionSimple as insertNodeAtCursorPosition } from './utils'

interface InputWithDropdownState {
  dropdownOpen?: boolean
  inputValue?: any
}

class InputWithDropdownExample extends React.Component<{}, InputWithDropdownState> {
  private readonly mountNodeId = 'dropdown-mount-node'
  private inputRef = React.createRef<HTMLInputElement>()
  private contentEditableRef = React.createRef<HTMLElement>()

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
        <SimpleContentEditable
          ref={this.contentEditableRef as any}
          // html={this.state.inputValue}
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp}
          // onKeyUp={() => this.logCaretPosition('onKeyUp')}
          // onClick={() => this.logCaretPosition('onClick')}
          // onFocus={() => this.logCaretPosition('onFocus')}
        />
      </Box>
    )
  }

  private handleChange = (e: React.SyntheticEvent<HTMLElement>) => {
    const html = _.get(e, 'target.value')
    console.log('handleChange html: ', html)
    // this.logCaretPosition('handleChange')
    // this.setState({ inputValue: html })
  }

  private handleKeyUp = (e: React.KeyboardEvent) => {
    // this.logCaretPosition('handleKeyUp')
    const code = keyboardKey.getCode(e)
    console.log('handleKeyUp key: ', String.fromCharCode(code))
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
    insertNodeAtCursorPosition(this.mountNodeId)

    const node = this.getMountNode()
    ReactDOM.render(
      <Provider theme={themes.teams}>
        <Dropdown
          defaultOpen={true}
          inline
          search
          items={atMentionItems}
          toggleIndicator={null}
          // inputRef={this.setInputNode}
          searchInput={{ input: { autoFocus: true } }}
          inputRef={this.inputRef}
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

  // private setInputNode = (node: HTMLElement) => (this.inputNode = node)

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
