import { 
  FETCH_SALES, 
  ADD_SALE, 
  EDIT_SALE, 
  DELETE_SALE, 
  SET_LOADING, 
  SET_ERROR,
} from '../actions/saleActions';

const initialState = {
  sales: [],
  total: 0,        // Adding fields for pagination
  totalPage: 0,
  loading: false,
  error: null,
};

const salesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SALES:
      return { 
        ...state, 
        sales: action.payload.data,
        total: action.payload.total,
        totalPage: action.payload.totalPage
      };
    case ADD_SALE:
      return { 
        ...state, 
        sales: [...state.sales, action.payload]
      };
      // Assuming action.payload contains sale ID and updated data
      return { 
        ...state, 
        sales: state.sales.map(sale =>
          sale.SALE_ID === action.payload.SALE_ID
            ? { ...sale, ...action.payload.updatedData }
            : sale
        )
      };
    case DELETE_SALE:
      return { 
        ...state, 
        sales: state.sales.filter(sale => sale.SALE_ID !== action.payload)
      };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default salesReducer;
