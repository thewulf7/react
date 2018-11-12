import React from 'react'
import { Button, Popup } from '@stardust-ui/react'

class PopupExample extends React.Component {
  state = { open: false }

  handleOpenChange = (e, { open }) => {
    console.log('handleOpenChange')
    this.setState({ open })
  }

  render() {
    return (
      <Popup
        open={this.state.open}
        onOpenChange={this.handleOpenChange}
        trigger={<Button icon="expand" />}
        content={{
          content: <input />,
        }}
      />
    )
  }
}

export default PopupExample
