import React from 'react'
import { Menu, Provider, Text } from '@stardust-ui/react'

const items = [
  { key: 'home', icon: 'home', content: <Text content="Activity" size="smaller" /> },
  { key: 'search', icon: 'team-create', content: <Text content="Teams" size="smaller" /> },
  { key: 'calendar', icon: 'calendar', content: <Text content="Calendar" size="smaller" /> },
  { key: 'calls', icon: 'call', content: <Text content="Calls" size="smaller" /> },
]

const LeftRail = () => (
  <Provider
    theme={{
      componentStyles: {
        Menu: {
          root: ({ theme: { siteVariables } }) => ({
            backgroundColor: siteVariables.brand06,
            width: '60px',
            borderRadius: 'none',
          }),
        },
        MenuItem: {
          root: ({ theme: { siteVariables } }) => ({
            color: siteVariables.white,
          }),
        },
      },
    }}
  >
    <Menu vertical defaultActiveIndex={0} items={items} primary />
  </Provider>
)

export default LeftRail
