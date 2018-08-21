import * as React from 'react'

import { getTestingRenderedComponent } from 'test/utils'
import { DefaultBehavior } from 'src/lib/accessibility'
import { Accessibility, AriaRole } from 'src/lib/accessibility/interfaces'
import { FocusZone } from 'src/lib/accessibility/FocusZone'

const getProp = (renderedComponent, propName, partSelector, isWrappedInFocusZone) => {
  const target = partSelector
    ? renderedComponent.render().find(partSelector)
    : renderedComponent.render()

  let node = target.first()
  if (isWrappedInFocusZone) {
    node = node.children().first() // traverse through FocusZone <div>
  }
  return node.prop(propName)
}

const overriddenRootRole = 'test-mock-role' as AriaRole

const TestBehavior: Accessibility = (props: any) => ({
  attributes: {
    root: {
      role: overriddenRootRole,
    },
  },
})

/**
 * Assert Component handles accessibility attributes correctly.
 * @param {React.Component|Function} Component A component that should conform.
 * @param {Object} [options={}]
 * @param {Object} [options.requiredProps={}] Props required to render Component without errors or warnings.
 * @param {string} [options.defaultRootRole=''] Default root role rendered when no override provided
 * @param {string} [options.partSelector=''] Selector to scope the test to a part
 * @param {boolean} [options.wrappedInFocusZone=false] If the component should be wrapped in FocusZone
 */
export default (Component, options: any = {}) => {
  const {
    requiredProps = {},
    defaultRootRole,
    partSelector = '',
    isWrappedInFocusZone = false,
  } = options

  test('gets default accessibility when no override used', () => {
    const rendered = getTestingRenderedComponent(Component, <Component {...requiredProps} />)
    const role = getProp(rendered, 'role', partSelector, isWrappedInFocusZone)
    expect(role).toBe(defaultRootRole)
  })

  test('does not get role when overrides to default', () => {
    const rendered = getTestingRenderedComponent(
      Component,
      <Component {...requiredProps} accessibility={DefaultBehavior} />,
    )
    const role = getProp(rendered, 'role', partSelector, isWrappedInFocusZone)
    expect(role).toBeFalsy()
  })

  if (!partSelector) {
    // temporarily disabled as we do not support overriding of attributes applied to parts
    test('gets correct role when overrides accessibility', () => {
      const rendered = getTestingRenderedComponent(
        Component,
        <Component {...requiredProps} accessibility={TestBehavior} />,
      )
      const role = getProp(rendered, 'role', partSelector, false)
      expect(role).toBe(overriddenRootRole)
    })

    test('gets correct role when overrides role', () => {
      const testRole = 'test-role'
      const rendered = getTestingRenderedComponent(
        Component,
        <Component {...requiredProps} role={testRole} />,
      )
      const role = getProp(rendered, 'role', partSelector, isWrappedInFocusZone)
      expect(role).toBe(testRole)
    })

    test('gets correct role when overrides both accessibility and role', () => {
      const testRole = 'test-role'
      const rendered = getTestingRenderedComponent(
        Component,
        <Component {...requiredProps} accessibility={TestBehavior} role={testRole} />,
      )
      const role = getProp(rendered, 'role', partSelector, false)
      expect(role).toBe(testRole)
    })
  }

  if (isWrappedInFocusZone) {
    test('gets wrapped in FocusZone', () => {
      const rendered = getTestingRenderedComponent(Component, <Component {...requiredProps} />)

      const focusZones = rendered.find(FocusZone)
      expect(focusZones).toHaveLength(1)

      const focusZoneDiv = focusZones.first().childAt(0)
      expect(focusZoneDiv.type()).toBe('div')
      expect(focusZoneDiv.children().length).toBeGreaterThan(0)
    })
  }
}