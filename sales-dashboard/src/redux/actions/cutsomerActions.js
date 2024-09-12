import axios from 'axios';

export const FETCH_CUSTOMERS = 'FETCH_CUSTOMERS';
export const ADD_CUSTOMER = 'ADD_CUSTOMER';
export const EDIT_CUSTOMER = 'EDIT_CUSTOMER';
export const DELETE_CUSTOMER = 'DELETE_CUSTOMER';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';

export const fetchCustomers = () => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/customers/');
    dispatch({
      type: FETCH_CUSTOMERS,
      payload: response.data.data.map(item => ({
        key: item.CUSTOMER_ID,
        customerName: item.CUSTOMER_NAME
      })),
    });
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: error.message || 'Error fetching customers' });
    console.error('Error fetching customers:', error);
  }
  dispatch({ type: SET_LOADING, payload: false });
};

export const addCustomer = (values) => async (dispatch) => {
  try {
    await axios.post('http://127.0.0.1:8000/api/customers/create/', values);
    dispatch(fetchCustomers()); // Refetch customers after adding
  } catch (error) {
    console.error('Error adding customer:', error);
    dispatch({ type: SET_ERROR, payload: error.message || 'Error adding customer' });
  }
};

export const editCustomer = (customerId, updatedData) => async (dispatch) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      await axios.put(`http://127.0.0.1:8000/api/customers/update/${customerId}/`, updatedData, {
        withCredentials: true,
      });
      dispatch(fetchCustomers());
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message || 'Error updating customer' });
    }
    dispatch({ type: SET_LOADING, payload: false });
};

export const deleteCustomer = (id) => async (dispatch) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/customers/delete/${id}/`);
    dispatch(fetchCustomers()); // Refetch customers after deleting
  } catch (error) {
    console.error('Error deleting customer:', error);
    dispatch({ type: SET_ERROR, payload: error.message || 'Error deleting customer' });
  }
};
