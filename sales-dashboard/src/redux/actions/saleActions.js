import axios from 'axios';

export const FETCH_SALES = 'FETCH_SALES';
export const ADD_SALE = 'ADD_SALE';
export const EDIT_SALE = 'EDIT_SALE';
export const DELETE_SALE = 'DELETE_SALE';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';

export const fetchSales = (params) => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/sales/', {
      params
    });
    dispatch({
      type: FETCH_SALES,
      payload: {
        data: response.data.data.map(item => ({
          key: item.SALE_ID,
          SALE_DATE: item.SALE_DATE,
          CUSTOMER_NAME: item.CUSTOMER_NAME,
          SALE_ITEMS_TOTAL: item.SALE_ITEMS_TOTAL,
          TOTAL_PRICE: item.TOTAL_PRICE
        })),
        total: response.data.total_data,
        totalPage: response.data.total_page
      },
    });
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: error.message || 'Error fetching sales' });
    console.error('Error fetching sales:', error);
  }
  dispatch({ type: SET_LOADING, payload: false });
};

export const addSale = (values) => async (dispatch) => {
  try {
    await axios.post('http://127.0.0.1:8000/api/sales/create/', values);
    dispatch(fetchSales({})); // Pass empty params to refetch all sales
  } catch (error) {
    console.error('Error adding sale:', error);
    dispatch({ type: SET_ERROR, payload: error.message || 'Error adding sale' });
  }
};

export const editSale = (saleId, updatedData) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING, payload: true });
    await axios.put(`http://127.0.0.1:8000/api/sales/update/${saleId}/`, updatedData);
    dispatch(fetchSales({})); // Pass empty params to refetch all sales
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: error.message || 'Error updating sale' });
  }
  dispatch({ type: SET_LOADING, payload: false });
};

export const deleteSale = (id) => async (dispatch) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/sales/delete/${id}/`);
    dispatch(fetchSales({})); // Pass empty params to refetch all sales
  } catch (error) {
    console.error('Error deleting sale:', error);
    dispatch({ type: SET_ERROR, payload: error.message || 'Error deleting sale' });
  }
};
