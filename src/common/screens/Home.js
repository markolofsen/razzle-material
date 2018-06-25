import React from 'react';
import withSSR from '../components/withSSR';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { translate, Trans } from 'react-i18next';
import Loadable from 'react-loadable';
// import NavWrapper from '../components/NavWrapper';
import axios from 'axios';


const Intro = Loadable({
  loader: () => import('./Intro'),
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

      // axios.get('https://api.github.com/repos/ccxt/ccxt').then(res => {
      //   resolve({
      //     text: res.data.full_name,
      //     currentRoute: match.pathname
      //   })
      // })

      setTimeout(() => {
        resolve({
          text: `
This text is server rendered if and only if it's the initial render.

Go to another route.
          `,
          currentRoute: match.pathname,
        });
      }, 500);
    });
  }

  render() {
    const { isLoading, text, error, classes } = this.props;
    const { t } = this.props;

    // function t(b) {
    //   return 'Cool';
    // }

    console.log(t('Welcome to Razzle'))

    return (
      <div>

        <h2>{t('Welcome to Razzle')}</h2>

        <Intro />

        <h1>Home</h1>

        {isLoading && <div>Loading... </div>}
        {error &&
          <div style={{ color: 'red' }}>
            {JSON.stringify(error, null, 2)}
          </div>}
        {text &&
          <div>
            ??{text}
          </div>}
      </div>
    );
  }
}

Home.propTypes = {
  // classes: PropTypes.object.isRequired,
  // t: PropTypes.func.isRequired,
};

// export default withStyles(styles)(withSSR(Home));

// export default (translate('translations', { wait: process && !process.release })(withSSR(Home)));
export default translate('translations', { wait: process && !process.release })(Home);
