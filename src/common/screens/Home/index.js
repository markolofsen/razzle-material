import React from 'react';
import withSSR from '../../components/withSSR';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Helmet} from "react-helmet";

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { translate, Trans } from 'react-i18next';
import Loadable from 'react-loadable';
import NavWrapper from '../../components/NavWrapper';
import axios from 'axios';


import ItemView from './ItemView/';

const Intro = Loadable({
  loader: () => import('../Intro'),
  loading: () => null,
});



const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    margin: theme.spacing.unit * 3,
  }),
});



// @translate(['header'])
class Home extends React.Component {

  // This works similarly to Next.js's `getInitialProps`
  static getInitialData({ match, req, res }) {
    return new Promise((resolve, reject) => {

      axios.get(`https://tenerifebook.com/api/catalog/tickets/list/false/?page=1`).then(res => {
        resolve({
          results: res.data.results,
          currentRoute: match.pathname
        })
      })

      // axios.get('https://data.ct.gov/resource/y6p2-px98.json?category=Fruit&item=Peaches').then(res => {
      //   resolve({
      //     text: res.data[0].business,
      //     currentRoute: match.pathname
      //   })
      // })

//       setTimeout(() => {
//         resolve({
//           text: `
// This text is server rendered if and only if it's the initial render.
//
// Go to another route.
//           `,
//           currentRoute: match.pathname,
//         });
//       }, 500);
    });
  }

  render() {
    const { isLoading, results, error, classes } = this.props;
    const { t } = this.props;

    // function t(b) {
    //   return 'Cool';
    // }

    // console.log(t('Welcome to Razzle'))


    return (
    	<div>

        <Helmet>
            <meta charSet="utf-8" />
            <title>My Title</title>
            <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>

    		<NavWrapper>

    			<div data-content>

    				<h2>{t('Welcome')}</h2>

    				<Intro/>

    				<h1>Home</h1>

    				{isLoading && <div>Loading...
    				</div>}
    				{error && <div style={{
    					color: 'red'
    				}}>
    					{JSON.stringify(error, null, 2)}
    				</div>}
    				{results && <div>
    					{results.map((item, index) => {
                return (
                  <div key={index}>
                    {item.title}
                  </div>
                )
              })}
    				</div>}
    			</div>

    		</NavWrapper>
    	</div>
    );

  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

// export default withStyles(styles)(withSSR(Home));

export default (translate('translations', { wait: process && !process.release })(withStyles(styles)(withSSR(Home))));
// export default translate('translations', { wait: process && !process.release })(Home);
