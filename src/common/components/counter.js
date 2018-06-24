import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

const Counter = ({
  increment,
  incrementIfOdd,
  incrementAsync,
  decrement,
  counter,
}) => (
  <p>
    Clicked: {counter} times
    {' '}
    <Button variant="contained" color="primary" onClick={increment}>+</Button>
    {' '}
    <Button variant="contained" color="primary" onClick={decrement}>-</Button>
    {' '}
    <Button variant="contained" color="primary" onClick={incrementIfOdd}>Increment if odd</Button>
    {' '}
    <Button variant="contained" color="primary" onClick={() => incrementAsync()}>Increment async</Button>
  </p>
);

Counter.propTypes = {
  increment: PropTypes.func.isRequired,
  incrementIfOdd: PropTypes.func.isRequired,
  incrementAsync: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  counter: PropTypes.number.isRequired,
};

export default Counter;