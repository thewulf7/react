import React from 'react'
import { Chat, Divider, Menu } from '@stardust-ui/react'

const ComplexMenu = () => (
  <Menu
    items={[{ key: 'a', icon: 'thumbs up' }, { key: 'b', icon: 'ellipsis horizontal' }, 'Nice!']}
    createItem={(MenuItem, props) => (
      <AsyncLikes
        render={likeCount => (
          <MenuItem
            {...props}
            content={
              <div>
                {likeCount} {props.content}
                <Menu
                  vertical
                  items={[
                    { key: 'a', content: 'deep: a' },
                    { key: 'b', content: 'deep: b' },
                    'Last!',
                  ]}
                  createItem={(MenuItem, props) => (
                    <AsyncLikes
                      render={count => (
                        <MenuItem
                          {...props}
                          content={[count, props.content].filter(Boolean).join(' ')}
                        />
                      )}
                    />
                  )}
                />
              </div>
            }
          />
        )}
      />
    )}
  />
)

class AsyncLikes extends React.Component<{ render: Function }> {
  state = { loading: true }

  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 2000 * (Math.random() + 0.5))
  }

  render() {
    const { loading } = this.state
    const { render } = this.props

    return loading ? 'LOADING...' : render(5)
  }
}

const TeamsChatMessage = () => {
  return (
    <Chat.Message
      styles={
        {
          '& .actions': {
            transition: 'opacity 0.1s, transform 0.1s',
            position: 'absolute',
            top: '-20px',
            right: '-50%',
            transform: 'translateY(5px)',
            background: '#fff',
            boxShadow: '0px 2px 4px #ddd',
            opacity: 0,
          },
          ':hover': {
            '& .actions': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        } as any
      }
      content={
        <div>
          Stuff on this message
          <ComplexMenu />
          {/*
          <Menu
            className="actions"
            items={[
              (MenuItem, props, children) => <MenuItem {...props}>{children}</MenuItem>,
              { key: 'a', icon: 'thumbs up' },
              { key: 'a', icon: 'ellipsis horizontal' },
              'Nice!',
              // (MenuItem, dust) => (
              //   <AsyncLikes
              //     render={() => (
              //       <li
              //         {...dust.classes.root}
              //         {...dust.accessibility.attributes.root}
              //         {...dust.accessibility.keyHandlers.root}
              //       >
              //         <a
              //           {...dust.classes.anchor}
              //           {...dust.accessibility.attributes.anchor}
              //           {...dust.accessibility.keyHandlers.anchor}
              //         >
              //           NICE!
              //         </a>
              //       </li>
              //     )}
              //   />
              // ),
            ]}
          />
*/}
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
}

const items = [
  { content: <TeamsChatMessage /> },
  { content: <TeamsChatMessage /> },
  { content: <TeamsChatMessage /> },
]

const AsyncShorthand = () => <Chat items={items} />

export default AsyncShorthand
