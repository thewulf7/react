import React from 'react'
import { Button, Input } from '@stardust-ui/react'

class InputExample extends React.Component {
  state = { value: '' }

  stopControl = () => {
    this.setState({ value: undefined })
  }

  render() {
    return (
      <div>
        <Button onClick={this.stopControl} content="stop" />
        <Input
          onChange={e => this.setState({ value: e.target.value })}
          value={this.state.value}
          placeholder="Search..."
        />
      </div>
    )
  }
}

export default InputExample
