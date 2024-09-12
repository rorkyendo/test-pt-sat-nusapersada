import axios from 'axios';

export const FETCH_PRODUCTS = 'FETCH_PRODUCTS';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const EDIT_PRODUCT = 'EDIT_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';

export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: SET_LOADING, payload: true });
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/products/');
    dispatch({
      type: FETCH_PRODUCTS,
      payload: response.data.data.map(item => ({
        key: item.PRODUCT_ID,
        productCode: item.PRODUCT_CODE,
        productName: item.PRODUCT_NAME,
        productPrice: `Rp. ${item.PRODUCT_PRICE.toLocaleString()}`,
        productStock: item.PRODUCT_STOCK,
        productStatus: item.PRODUCT_STATUS
      })),
    });
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: error.message || 'Error fetching products' });
    console.error('Error fetching products:', error);
  }
  dispatch({ type: SET_LOADING, payload: false });
};

export const addProduct = (values) => async (dispatch) => {
  try {
    await axios.post('http://127.0.0.1:8000/api/products/create/', values);
    dispatch(fetchProducts()); // Refetch products after adding
  } catch (error) {
    console.error('Error adding product:', error);
    dispatch({ type: SET_ERROR, payload: error.message || 'Error adding product' });
  }
};

export const editProduct = (productId, updatedData) => async (dispatch) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      await axios.put(`http://127.0.0.1:8000/api/products/update/${productId}/`, updatedData, {
        withCredentials: true,
      });
      dispatch(fetchProducts());
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message || 'Error updating product' });
    }
    dispatch({ type: SET_LOADING, payload: false });
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/products/delete/${id}/`);
    dispatch(fetchProducts()); // Refetch products after deleting
  } catch (error) {
    console.error('Error deleting product:', error);
    dispatch({ type: SET_ERROR, payload: error.message || 'Error deleting product' });
  }
};

export const searchProductCode = async (params) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/products/code/${params}/`);
    return response.data;
  } catch (error) {
    console.error('Error getting product:', error);
  }
};
