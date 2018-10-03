import * as React from 'react'
import { Button, Input, Header, Popup } from '@stardust-ui/react'

//
// Popup should always render its children, rendering the trigger is weird
// Trigger concept is brittle since cloning/adding listeners doesn't work with all triggers
// A 'context' prop taking a node reference is more flexible than trigger and does not have the brittle aspects
// There should be this API;
//  - open
//  - onOpen
//  - onClose

// Typings
// Static (subcomponents) are not showing in intellisense
// Investigate shorthand intellisense and conditional override types (string, number, props, render func)

class Levi extends React.Component {
  state = { open: false }

  handleOpen = (e, data) => this.setState({ open: !data.open })

  render() {
    return (
      <div>
        <img width="400" src="public/images/proto-add-users.png" />
        <hr />
        <Button.Group
          circular
          buttons={[
            { key: 'a', icon: 'camera', type: 'primary' },
            { key: 'b', icon: 'phone', type: 'primary' },
            { key: 'c', icon: 'upload', type: 'primary' },
            <Popup
              open={this.state.open}
              onOpenChange={this.handleOpen}
              onClose
              onOpen
              trigger={<Button circular icon="add user" type="secondary" />}
              content={
                <>
                  <Input placeholder="Start typing" />
                  <Button>Cancel</Button>
                  <Button>Add</Button>
                </>
              }
            />,
          ]}
        />
      </div>
    )
  }
}

export default Levi
