import { combineReducers } from 'redux';
import counter from './counter';
import config from './config';

const rootReducer = combineReducers({
  counter,
  config
});

export default rootReducer;
