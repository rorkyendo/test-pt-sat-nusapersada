import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Row, Col, Input, Form, Input as AntInput, Button, Select, notification, InputNumber, Popconfirm } from 'antd';
import '../styles/TransactionHistoryTable.css';

const { Option } = Select;

const Transaction = () => {
  const [form] = Form.useForm();
  const [customerData, setCustomer] = useState([]);
  const [saleID, setSaleID] = useState('');
  const [cart, setCart] = useState([]); // Menyimpan produk yang sudah ditambahkan
  const [prodData, setProdData] = useState(null); // Data produk yang dicari
  const [loading, setLoading] = useState(false);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]); // Initialize with today's date

  useEffect(() => {
    fetchData();
    lastSaleID();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/customers/');
      setCustomer(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const lastSaleID = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/sales/last/');
      if (Object.keys(response.data.data).length > 0) {
        setSaleID(response.data.data.SALE_ID);
        sessionStorage.setItem('saleID', response.data.data.SALE_ID);
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
      const response = await axios.get(`http://127.0.0.1:8000/api/products/code/${value}/`);
      if (response.data.status === 400) {
        notification.error({
          message: 'Error',
          description: response.data.message,
        });
        setProdData(null);
      } else if (Object.keys(response.data.data).length > 0) {
        setProdData(response.data.data);
        notification.success({
          message: 'Success',
          description: `Product Found: ${response.data.data.PRODUCT_NAME}`,
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
      SALE_DATE: saleDate, // Use saleDate for transaction date
      CUSTOMER_ID: values.CUSTOMER_ID,
      SALE_ITEMS: cart.map(item => ({
        PRODUCT_ID: item.PRODUCT_ID,
        PRODUCT_PRICE: item.PRODUCT_PRICE,
        ITEM_QTY: item.ITEM_QTY,
        IS_VERIFY: item.IS_VERIFY,
      })),
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/sales/create/', payload);
      notification.success({
        message: 'Success',
        description: 'Transaction added successfully!',
      });
      setCart([]); // Clear cart after successful transaction
      form.resetFields();
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
              rules={[{ required: true, message: 'Please input transaction date!' }]}
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
              rules={[{ required: true, message: 'Please select the customer!' }]}
              style={{ marginBottom: '-35px' }}
            ></Form.Item>
          </Col>
          <Col xs={24} md={20}>
            <Select placeholder="Select Customer" style={{ width: '100%' }}>
              {customerData.map((customer) => (
                <Option key={customer.CUSTOMER_ID} value={customer.CUSTOMER_ID}>
                  {customer.CUSTOMER_NAME}
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
