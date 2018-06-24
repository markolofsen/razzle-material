import React from 'react';
import { Provider } from 'react-redux';
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider, createMuiTheme, createGenerateClassName } from '@material-ui/core/styles';
import { green, red } from '@material-ui/core/colors';
import Theme from './../common/theme';
import { Helmet } from 'react-helmet';
import configureStore from '../common/store/configureStore';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import { StaticRouter } from 'react-router'
import NavigationRoutes from './../common/routes';
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const context = {};

export function handleRender(req, res) {

  const counter = parseInt(10) ||  0;
  // Compile an initial state
  const preloadedState = { counter };

  // Create a new Redux store instance
  const store = configureStore(preloadedState);
  const helmet = Helmet.renderStatic();

  // Grab the initial state from our Redux store
  const finalState = store.getState();
  // Create a sheetsRegistry instance.
  const sheetsRegistry = new SheetsRegistry();
  const generateClassName = createGenerateClassName();

  // Render the component to a string.
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
          <MuiThemeProvider theme={Theme} sheetsManager={new Map()}>
            <NavigationRoutes />
          </MuiThemeProvider>
        </JssProvider>
      </StaticRouter>
    </Provider>
  )

  // Grab the CSS from our sheetsRegistry.
  const css = sheetsRegistry.toString()

  // Send the rendered page back to the client.
  res.send(renderFullPage(html, css, helmet, finalState))
}

function renderFullPage(markup, css, helmet, finalState) {
  return `<!doctype html>
    <html lang="en" ${helmet.htmlAttributes.toString()}>
    <head>
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      ${assets.client.css
      ? `<link rel="stylesheet" href="${assets.client.css}">`
      : '' }
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet='utf-8' />
      <title>Razzle Redux Example</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">

      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      
      ${process.env.NODE_ENV === 'production'
      ? `<script src="${assets.client.js}" defer></script>`
      : `<script src="${assets.client.js}" defer crossorigin></script>`}
    </head>
    <body ${helmet.bodyAttributes.toString()}>
      <div id="root">${markup}</div>
      <style id="jss-server-side">${css}</style>
      <script>
        window.__PRELOADED_STATE__ = ${serialize(finalState)}
      </script>
    </body>
  </html>`;
}
