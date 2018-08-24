import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { Header as SUIRHeader, Icon } from 'semantic-ui-react'
import { Button, Label } from '@stardust-ui/react'

import DocPage from '../components/DocPage/DocPage'
import ExampleSnippet from '../components/ExampleSnippet/ExampleSnippet'

export default () => (
  <DocPage title="Shorthand">
    <SUIRHeader as="h2" content="Overview" />
    <p>
      Stardust provides a simple yet very powerful API for defining each part of a component, such
      as the <code>icon</code> part of a <code>Button</code>. Shorthand allows you to:
    </p>

    <SUIRHeader as="h2">
      <code>content</code>
    </SUIRHeader>
    <p>
      Components that can contain content support the <code>content</code> shorthand prop. This
      defines the primary content of the component.
    </p>

    <SUIRHeader as="h2">Other parts</SUIRHeader>
    <p>
      Components are defined according to their <NavLink to="component-anatomy">anatomy</NavLink>.
      Each part of a component's anatomy can be defined using shorthand.
    </p>

    <SUIRHeader as="h2">Shorthand Values</SUIRHeader>
    <p>
      Shorthand props accept strings, numbers, props objects, or React elements. This gives you a
      simple yet powerful API for defining each part of a component.
    </p>

    <ExampleSnippet
      mode="jsx"
      value={[
        '// Primitive values',
        '<Button icon="user" />',
        '<Label content={13} />',
        '',
        '// Props',
        "<Button icon={{ name: 'user', circular: true }} />",
        '',
        '// Elements',
        '<Button icon={<Icon name="user" circular />} />',
      ].join('\n')}
      render={() => (
        <div>
          <Button icon="user" />
          <Label content={13} />
          <Button icon={{ name: 'user', circular: true }} />
          <Button icon={<Icon name="user" circular />} />
        </div>
      )}
    />
  </DocPage>
)
