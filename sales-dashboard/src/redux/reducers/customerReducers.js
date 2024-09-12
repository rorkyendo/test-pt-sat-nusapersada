import { FETCH_CUSTOMERS, SET_LOADING, SET_ERROR } from '../actions/cutsomerActions';

const initialState = {
  customers: [],
  loading: false,
  error: null,
};

const customersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CUSTOMERS:
      return { ...state, customers: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default customersReducer;
