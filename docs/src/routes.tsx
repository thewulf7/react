import * as React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import ExternalExampleLayout from './components/ExternalExampleLayout'
import DocsLayout from './components/DocsLayout'
import DocsRoot from './components/DocsRoot'

import ComponentAnatomy from './views/ComponentAnatomy'
import CSSInJS from './views/CSSInJS'
import Introduction from './views/Introduction'
import PageNotFound from './views/PageNotFound'
import QuickStart from './views/QuickStart'
import Shorthand from './views/Shorthand'
import Theming from './views/Theming'

const Router = () => (
  <BrowserRouter basename={__BASENAME__}>
    <Switch>
      <Route exact path="/maximize/:exampleName" component={ExternalExampleLayout} />
      <Switch>
        <DocsLayout exact path="/" component={Introduction} />
        <DocsLayout exact path="/:type/:name" component={DocsRoot} sidebar />
        <DocsLayout exact path="/component-anatomy" component={ComponentAnatomy} />
        <DocsLayout exact path="/css-in-js" component={CSSInJS} />
        <DocsLayout exact path="/quick-start" component={QuickStart} />
        <DocsLayout exact path="/shorthand" component={Shorthand} />
        <DocsLayout exact path="/theming" component={Theming} />
        <DocsLayout exact path="/*" component={PageNotFound} />
      </Switch>
    </Switch>
  </BrowserRouter>
)

export default Router
