import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '../redux/actions/cutsomerActions';
import { lastSale } from '../redux/actions/saleActions';
import { searchProductCode } from '../redux/actions/productActions';
import { Table, Row, Col, Input, Form, Input as AntInput, Button, Select, notification, InputNumber, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../styles/TransactionHistoryTable.css';

const { Option } = Select;

const Transaction = () => {
  const dispatch = useDispatch();

  const { customers } = useSelector(state => state.customerState);
  const [form] = Form.useForm();
  const [customerData, setCustomer] = useState([]);
  const [saleID, setSaleID] = useState('');
  const [customerID, setCustomerID] = useState('');
  const [cart, setCart] = useState([]); // Menyimpan produk yang sudah ditambahkan
  const [prodData, setProdData] = useState(null); // Data produk yang dicari
  const [loading, setLoading] = useState(false);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]); // Initialize with today's date
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    setCustomer(customers)
    lastSaleID();
  }, [customers]);

  const lastSaleID = async () => {
    setLoading(true);
    try {
      const response = await lastSale();
      if (Object.keys(response.data).length > 0) {
        setSaleID(response.data.sale_id+1);
        sessionStorage.setItem('saleID', response.data.data.sale_id+1);
      } else {
        setSaleID('1');
        sessionStorage.setItem('saleID', '1');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const searchProduct = async (value) => {
    setLoading(true);
    try {
      const response = await searchProductCode(value);
      if (response.status === 400) {
        notification.error({
          message: 'Error',
          description: response.data.message,
        });
        setProdData(null);
      } else if (Object.keys(response.data).length > 0) {
        setProdData(response.data);
        notification.success({
          message: 'Success',
          description: `Product Found: ${response.data.PRODUCT_NAME}`,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to Find Product.',
      });
    }
    setLoading(false);
  };
  

  const addToCart = (product) => {
    if (!product) return;

    const productExists = cart.find(item => item.PRODUCT_ID === product.PRODUCT_ID);
    if (productExists) {
      notification.warning({
        message: 'Product Already in Cart',
        description: 'This product has already been added.',
      });
    } else {
      setCart([...cart, { ...product, ITEM_QTY: 1, IS_VERIFY: false }]);
    }
  };

  const handleQuantityChange = (value, productId) => {
    setCart(cart.map(item => item.PRODUCT_ID === productId ? { ...item, ITEM_QTY: value } : item));
  };

  const handleRemoveProduct = (productId) => {
    setCart(cart.filter(item => item.PRODUCT_ID !== productId));
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    const payload = {
      SALE_DATE: saleDate,
      CUSTOMER_ID: customerID,
      SALE_ITEMS: cart.map(item => ({
        PRODUCT_ID: item.PRODUCT_ID,
        PRODUCT_PRICE: item.PRODUCT_PRICE,
        ITEM_QTY: item.ITEM_QTY,
        IS_VERIFY: item.IS_VERIFY,
      })),
    };
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/sales/create/', payload);
      const { message, items } = response.data;
      const totalItems = message[0].total_items;
      const totalSuccess = message[0].total_success;
      const totalFailed = message[0].total_failed;
  
      notification.success({
        message: 'Transaction Summary',
        description: `Total Items: ${totalItems}, Success: ${totalSuccess}, Failed: ${totalFailed}`,
      });
  
      // Optional: Display detailed status for each item if needed
      items.forEach(item => {
        notification.info({
          message: `Item ${item.id}`,
          description: `Price: ${item.price}, Quantity: ${item.qty}, Status: ${item.status}`,
        });
      });
  
      setCart([]); // Clear cart after successful transaction
      form.resetFields();
      navigate('/');
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to add transaction.',
      });
    }
    setLoading(false);
  };
  
  const columns = [
    {
      title: 'No',
      key: 'no',
      render: (text, record, index) => index + 1, // Menambahkan nomor urut
    },
    {
      title: 'Product Code',
      dataIndex: 'PRODUCT_CODE',
      key: 'PRODUCT_CODE',
    },
    {
      title: 'Product Name',
      dataIndex: 'PRODUCT_NAME',
      key: 'PRODUCT_NAME',
    },
    {
      title: 'Qty',
      dataIndex: 'ITEM_QTY',
      key: 'ITEM_QTY',
      render: (text, record) => (
        <InputNumber
          min={1}
          value={record.ITEM_QTY}
          onChange={(value) => handleQuantityChange(value, record.PRODUCT_ID)}
        />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (text, record) => record.PRODUCT_PRICE * record.ITEM_QTY, // Hitung subtotal
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Popconfirm title="Sure to delete?" onConfirm={() => handleRemoveProduct(record.PRODUCT_ID)}>
          <Button danger>Remove</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="product-table">
      <h1>Transaction</h1>
      <hr />
      <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={4}>
            <Form.Item label="Transaction Code" style={{ marginBottom: '-35px' }}></Form.Item>
          </Col>
          <Col xs={24} md={20}>
            <AntInput value={saleID} readOnly={true} />
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
                label="Transaction Date"
                name="SALE_DATE"
                style={{ marginBottom: '-35px' }}
            ></Form.Item>
          </Col>
          <Col xs={24} md={20}>
            <AntInput type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
          </Col>
          <Col xs={24} md={4}>
            <Form.Item
              label="Customer"
              name="CUSTOMER_ID"
              style={{ marginBottom: '-35px' }}
            ></Form.Item>
          </Col>
          <Col xs={24} md={20}>
            <Select
              placeholder="Select Customer"
              onChange={(value) => {
                setCustomerID(value);
              }}
              style={{ width: '100%' }}
            >
              {customers.map((customer) => (
                <Option key={customer.key} value={customer.key}>
                  {customer.customerName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Form.Item label="Product" style={{ marginBottom: '-35px' }}></Form.Item>
          </Col>
          <Col xs={24} md={20}>
            <AntInput placeholder="Search Product By Product Code Here.." onChange={(e) => searchProduct(e.target.value)} />
          </Col>
          <Col xs={24} md={24}>
            <Form.Item>
              <Button type="primary" onClick={() => addToCart(prodData)} disabled={!prodData}>
                Add Product
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Table columns={columns} dataSource={cart} rowKey="PRODUCT_ID" pagination={false} />
        <Row>
          <Col xs={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={cart.length === 0} style={{marginTop:20}}>
                Submit Transaction
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Transaction;
