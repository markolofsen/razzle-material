// import React from 'react';
// import { hydrate } from 'react-dom';
// import { Provider } from 'react-redux';
// import configureStore from '../common/store/configureStore';
// import { BrowserRouter as Router } from 'react-router-dom';
// import NavigationRoutes from './../common/routes';
//
// const store = configureStore(window.__PRELOADED_STATE__);
//
// hydrate(
//   <Provider store={store}>
//     <Router>
//       <NavigationRoutes />
//     </Router>
//   </Provider>,
//   document.getElementById('root')
// );
//
// if (module.hot) {
//   module.hot.accept();
// }
import App from '../common/App';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { render } from 'react-dom';
import routes from '../common/routes';

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

const data = window._INITIAL_DATA_;

// render(
//   <BrowserRouter>
//     <App routes={routes} initialData={data} />
//   </BrowserRouter>,
//   document.getElementById('root')
// );

render(
  <I18nextProvider
    i18n={ i18n }
    initialI18nStore={window.initialI18nStore}
    initialLanguage={window.initialLanguage}
  >
    <BrowserRouter>
      <App routes={routes} initialData={data} />
    </BrowserRouter>
  </I18nextProvider>,
  document.getElementById('root')
);


if (module.hot) {
  module.hot.accept();
}
