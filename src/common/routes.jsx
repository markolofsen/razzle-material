import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './pages/home'
import Counter from './pages/counter'
import Layout from './../common/components/layout';
import {Helmet} from "react-helmet";

const NavigationRoutes = () => (
  <Switch>
    <Layout>
      <Helmet
        htmlAttributes={{lang: "en", amp: undefined}} // amp takes no value
        title="EventZOC"/>    
      <Route exact path="/" component={Home} />
      <Route exact path="/counter" component={Counter} />
    </Layout>  
  </Switch>
);

export default NavigationRoutes;