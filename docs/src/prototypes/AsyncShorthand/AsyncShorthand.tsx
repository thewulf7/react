import * as _ from 'lodash'
import * as React from 'react'
import { Chat, Menu } from '@stardust-ui/react'

/**
 * This example shows how to create custom Chat Messages.
 * The chat message also includes inline async data fetching for child component props.
 */

// Mock async data container component
class LikeContainer extends React.Component<{ render: Function; renderLoading: Function }> {
  state = { loading: true }

  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), _.random(500, 2000))
  }

  render() {
    return this.state.loading ? this.props.renderLoading() : this.props.render(5)
  }
}

const CustomChatMessage = () => (
  <Chat.Message
    styles={{
      position: 'relative',
      '& .actions': {
        position: 'absolute',
        top: '-10px',
        right: '10px',
        background: '#fff',
        boxShadow: '0px 2px 4px #ddd',
      },
    }}
    content={
      <div>
        This message has an async like count.
        <Menu
          iconOnly
          className="actions"
          items={[{ key: 'a', icon: 'thumbs up' }, { key: 'b', icon: 'ellipsis horizontal' }]}
          renderItem={(MenuItem, props) =>
            props.icon === 'thumbs up' ? (
              <LikeContainer
                renderLoading={() => <MenuItem {...props} icon="thumbs up" />}
                render={likeCount => <MenuItem {...props} icon="thumbs up" content={likeCount} />}
              />
            ) : (
              <MenuItem {...props} />
            )
          }
        />
      </div>
    }
    author="Jane Doe"
    timestamp="Yesterday, 10:15 PM"
    avatar={{
      image: 'public/images/avatar/small/ade.jpg',
      status: { color: 'green', icon: 'check' },
    }}
  />
)

const AsyncShorthand = () => (
  <Chat
    items={[
      { content: <CustomChatMessage /> },
      { content: <CustomChatMessage /> },
      { content: <CustomChatMessage /> },
    ]}
  />
)

export default AsyncShorthand
