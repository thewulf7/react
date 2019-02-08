import * as React from 'react'
import { PrototypeSection, ComponentPrototype } from '../Protoypes'
import AsyncDropdownSearch from './AsyncDropdownSearch'
import InputWithDropdownExample from './inputWithDropdown'
import CustomInputDropdown from './CustomInputDropdown'

export default () => (
  <PrototypeSection title="Dropdowns">
    <ComponentPrototype
      title="Async Dropdown Search"
      description="Use the field to perform a simulated search."
    >
      <AsyncDropdownSearch />
    </ComponentPrototype>
    <ComponentPrototype
      title="Input with Dropdown"
      description="Use the '@' key to mention people."
    >
      <InputWithDropdownExample />
    </ComponentPrototype>
    <ComponentPrototype
      title="Custom Input with Dropdown"
      description="Use the '@' key to mention people."
    >
      <CustomInputDropdown />
    </ComponentPrototype>
  </PrototypeSection>
)
