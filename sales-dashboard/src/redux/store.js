import { thunk } from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import { combineReducers } from 'redux';
import productsReducer from './reducers/productReducers';
import customersReducer from './reducers/customerReducers';
import salesReducer from './reducers/saleRedurecs';

const rootReducer = combineReducers({
  productsState: productsReducer,
  customerState: customersReducer,
  saleState: salesReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
