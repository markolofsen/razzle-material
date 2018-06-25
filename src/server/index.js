import { StaticRouter, matchPath } from 'react-router-dom';

import App from '../common/App';
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import routes from '../common/routes';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const server = express();

import {Helmet} from "react-helmet";
import { Provider } from 'react-redux';
import configureStore from '../common/store/configureStore';
import serialize from 'serialize-javascript';


const i18nextMiddleware = require('i18next-express-middleware'); // has no proper import yet
import Backend from 'i18next-node-fs-backend';
import i18n from '../i18n';
import { I18nextProvider } from 'react-i18next';

i18n
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    preload: ['en', 'de'],
    backend: {
      loadPath: __dirname + './../locales/{{lng}}/{{ns}}.json',
      addPath: __dirname + './../locales/{{lng}}/{{ns}}.missing.json'
    }
  }, () => {


  server
    .disable('x-powered-by')
    .use(i18nextMiddleware.handle(i18n))
    .use('/locales', express.static(__dirname + './../locales'))
    .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
    .get('/*', (req, res) => {
      // This data fetching technique came from a gist by @ryanflorence
      // @see https://gist.github.com/ryanflorence/efbe562332d4f1cc9331202669763741

      // First we iterate through our top level routes
      // looking for matches against the current url.
        const matches = routes.map((route, index) => {
        const match = matchPath(req.url, route.path, route);
        // We then look for static getInitialData function on each top level component
        if (match) {
          const obj = {
            route,
            match,
            promise: route.component.getInitialData
              ? route.component.getInitialData({ match, req, res })
              : Promise.resolve(null),
          };
          return obj;
        }
        return null;
      });

      if (matches.length === 0) {
        res.status(404).send('Not Found');
      }

      // Now we pull out all the promises we found into an array.
      const promises = matches.map(match => (match ? match.promise : null));

      // We block rendering until all promises have resolved
      Promise.all(promises)
        .then(data => {
          const context = {};

          // Pass our routes and data array to our App component
          // const markup = renderToString(
          //   <StaticRouter context={context} location={req.url}>
          //     <App routes={routes} initialData={data} />
          //   </StaticRouter>
          // );
          //
          // Create a new Redux store instance
          const store = configureStore();
          const finalState = store.getState();

          const markup = renderToString(
            <I18nextProvider i18n={req.i18n}>
              <Provider store={store}>
                <StaticRouter context={context} location={req.url}>
                  <App routes={routes} initialData={data} />
                </StaticRouter>
              </Provider>
            </I18nextProvider>
          );

          const helmet = Helmet.renderStatic();

          if (context.url) {
            res.redirect(context.url);
          } else {
            const initialI18nStore = {};
            req.i18n.languages.forEach((l) => {
              initialI18nStore[l] = req.i18n.services.resourceStore.data[l];
            });
            const initialLanguage = req.i18n.language;

            res.status(context.statusCode || 200).send(
              `<!doctype html>
            <html ${helmet.htmlAttributes.toString()}>
            <head>

                ${helmet.title.toString()}
                ${helmet.meta.toString()}
                ${helmet.link.toString()}

                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta charSet='utf-8' />
                <title>Welcome to Razzle</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">

                <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

                ${assets.client.css
                  ? `<link rel="stylesheet" href="${assets.client.css}">`
                  : ''}
                <script src="${assets.client.js}" defer></script>
                <script>
                  window.initialI18nStore = JSON.parse('${JSON.stringify(initialI18nStore)}');
                  window.initialLanguage = '${initialLanguage}';
                </script>
            </head>
            <body ${helmet.bodyAttributes.toString()}>
                <div id="root">${markup}</div>
                <script>
                  window.__PRELOADED_STATE__ = ${serialize(finalState)};
                  window._INITIAL_DATA_ = ${JSON.stringify(data)};
                </script>
            </body>
        </html>`
            );
          }
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({ error: error.message, stack: error.stack });
        });
    });

  });


export default server;
