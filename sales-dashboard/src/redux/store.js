import { thunk } from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import { combineReducers } from 'redux';
import productsReducer from './reducers/productReducers';
import customersReducer from './reducers/customerReducers';

const rootReducer = combineReducers({
  productsState: productsReducer,
  customerState: customersReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
