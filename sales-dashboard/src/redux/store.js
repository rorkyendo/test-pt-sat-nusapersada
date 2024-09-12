import { thunk } from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import { combineReducers } from 'redux';
import productsReducer from './reducers/productReducers';

const rootReducer = combineReducers({
  productsState: productsReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
