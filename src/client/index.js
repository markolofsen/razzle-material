import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../common/store/configureStore';
import { BrowserRouter as Router } from 'react-router-dom';
import NavigationRoutes from './../common/routes';

const store = configureStore(window.__PRELOADED_STATE__);

hydrate(
  <Provider store={store}>
    <Router>
      <NavigationRoutes />
    </Router>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}