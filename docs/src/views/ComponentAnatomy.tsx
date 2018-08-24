import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { Header, Icon } from 'semantic-ui-react'
import { Button, Divider, Provider, Text } from '@stardust-ui/react'

import CodeSnippet from '../components/CodeSnippet'
import DocPage from '../components/DocPage/DocPage'
import ExampleSnippet from '../components/ExampleSnippet/ExampleSnippet'
import { Accessibility } from '../../../src/lib/accessibility/interfaces'

export default () => (
  <DocPage title="Component Anatomy">
    <Header as="h2" content="Overview" />
    <p>
      Component anatomies are at the heart of Stardust. Standardized component anatomies enable
      Stardust to provide powerful APIs for shorthand component definition, styling, accessibility,
      and state management.
    </p>

    <Header as="h2" content="Component Parts" />
    <p>
      All Stardust components explicitly define named parts. The name of a component and its parts
      is collectively called the component's anatomy. Example, the anatomy of a
      <NavLink to="components/button">
        <code>Button</code>
      </NavLink>{' '}
      consists of a <code>root</code> part and <code>icon</code> part.
    </p>

    <Header as="h3" content="Root" />
    <p>
      All components define a <code>root</code> part. This is the root HTML element rendered by the
      component. An abstract name is appropriate here as the root element is configurable via the{' '}
      <code>as</code> prop.
    </p>

    <Header as="h3" content="Other parts" />
    <p>
      All other parts are consistent from component to component. Example, every component which can
      contain an <code>Icon</code> has an <code>icon</code> part. Having components with consistent
      parts reduces API surface area and concepts to learn.
    </p>

    <Header as="h2" content="Shorthand" />
    <p>
      Stardust provides a simple yet very powerful API for defining each part of a component, such
      as the <code>icon</code> part of a <code>Button</code>. Shorthand allows you to:
    </p>
    <ol>
      <li>
        <strong>Use shorthand:</strong>
        <ExampleSnippet
          mode="jsx"
          value={'<Button icon="user" />'}
          render={() => <Button icon="user" />}
        />
      </li>
      <li>
        <strong>Control Props</strong>
      </li>
      <li>
        <strong>Control Component</strong>
      </li>
      <li>
        <strong>Control Render Tree</strong>
      </li>
    </ol>
    <CodeSnippet
      value={[
        `const buttonStyle = {`,
        `  root: { display: 'inline-block' },`,
        `  icon: { marginRight: '1rem' },`,
        `}`,
      ].join('\n')}
    />

    <Header as="h2" content="Styling" />
    <p>
      Styling is applied to components according to their anatomy. That means every component part
      can be targeted for styling. This is done with a plain JavaScript object which maps component
      part names to their styles:
    </p>
    <CodeSnippet
      value={[
        `const buttonStyle = {`,
        `  root: { display: 'inline-block' },`,
        `  icon: { marginRight: '1rem' },`,
        `}`,
      ].join('\n')}
    />

    <p>
      Once these styles objects are rendered, we are given an object of CSS classes of the shape:
    </p>
    <CodeSnippet
      value={[`const buttonClasses = {`, `  root: 'a',`, `  icon: 'b',`, `}`].join('\n')}
    />

    <p>These CSS classes are applied to the component </p>
    <CodeSnippet
      label="pseudo implementation"
      value={[
        `const Button = props => {`,
        `  const Component = props.as || 'button'`,
        `  return (`,
        `    <Component {...`,
        `  )`,
        `}`,
      ].join('\n')}
    />

    <Header as="h2" content="Accessibility" />
    <p>
      Stardust components automatically apply <code>role</code> and <code>aria</code> props to
      components. This is done with vanilla JavaScript objects which define props for every
      component and each of its parts.
    </p>
    <CodeSnippet
      value={[
        `const ButtonBehavior = props => ({`,
        `  attributes: {`,
        `    root: {`,
        `      role: props.as === 'button' ? undefined : 'button',`,
        `      'aria-disabled': !!props.disabled,`,
        `    },`,
        `  },`,
        `})`,
      ].join('\n')}
    />
  </DocPage>
)
