- [ ] Recap vision and flow into how current effort implementing it?
- [ ] How does this interplay with Teams' current short term goals? How are the two serving each other? What needs to happen now and next?

-------------------------------------------------------------------

# Vision

## Problems

### Framework Lock In

Companies and teams often bake-in component business logic and theming into the paradigms of the current of choice.  When the time comes to switch frameworks, the company and the teams are forced to rewrite the same business logic and theming ideas using a new framework's API.

The more of this component logic and theming that can be stored in vanilla JS, free of framework APIs, the more it can be reused across many frameworks.  The additional benefit here is that vanilla JS often lends itself to simple JSON structures which enable over-the-wire transport, including iframe boundaries, and server side usage.  The prevalence of support for JSON make it an ideal candidate for storing front-end data concerns.     

### Framework Incompatibility

We expect all valid HTML, CSS, and JS to work in all browsers where it is supported.  HTML, CSS, and JS can be considered the common framework that web engineers use to build apps.

This framework (HTML, CSS, and JS) was found lacking in many ways so the community at large creatively iterated to create more robust components and user experiences.  This resulted in massive amounts of deviation and inconsistency which was necessary in order to progress.  Over the years, this evolution has settled down into many stable and useful UI components and ideas, such as the Dropdown and Modal.

So much of our UIs are now consistent and stable in features, however, we lack a massive fundamental advantage of vanilla HTML/CSS/JS.  Interoperability and consistency.

All valid HTML snippets will run in all browsers that support HTML.  All developers share the same language and markup for HTML.  A `<ul>` contains `<li>` elements, we all know this and can rely on it.  Developers are then able to produce stylesheets that can rely on these elements and their basic structures.  Without this expectation the web never could have evolved into what it is today.  

When it comes to modern frameworks, we throw this expectation out the window along with its benefits.  A shared and common language is essential to the success of any culture.  Modern UI components that are now pervasive on the web ought to have their names and structures standardized in order to restore some interoperability, consistency, and expectation.

## Goals

### Specifications Goals
Take a descriptivist approach to codifying UI components.  Looking around the world of UI and documenting what norms have emerged over the last few decades.   This is opposed  to the prescriptivist approach of creating new ideas and names and trying to convince others to use them.  
- Component Names
- Component Slots

### Implementation Goals
- Framework agnostic
- Tools and utilities to make adoption and adherence easier (linters, test suites, framework bindings, etc)

### Scope
- Component State
- Component Style
- Component Accessibility

## Approach

Specifications
- Descriptivism
- Natural Language (APIs and design language)

## Project Organization

### /stardust-ui

- GitHub organization
- Specifications
- Tools and Utilities

### /stardust-ui/react

The exemplar React bindings, demonstrating the implementation of the specs using our tools, utilities, and tests.

## Deliverables

### Styles

Provide CSS in JS styles

Provide flat style sheets
  - from calling CSS in JS styles
  - per theme
  - per component
  - class name generator function (from props)
  - enable consumers to use "class name build up" to implement styles (e.g. HTML, vuejs, angular, React w/o CSS in JS, etc.)

