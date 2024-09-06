import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Row, Col, Input, Form, Input as AntInput, Button, Select, Popconfirm, Spin, notification } from 'antd';
import '../styles/TransactionHistoryTable.css';

const { Search } = Input;
const { Option } = Select;

const Transaction = () => {
  const [form] = Form.useForm();
  const [customerData, setCustomer] = useState([]);
  const [saleID, setSaleID] = useState([]);
  const [prodData, setProdData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    lastSaleID();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/customers/');
      setCustomer(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const lastSaleID = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/lastSale/');
      if (Object.keys(response.data).length > 0) {
        setSaleID(response.data.SALE_ID);
        sessionStorage.setItem('saleID',response.data.SALE_ID)
      }else{
        setSaleID('1');
        sessionStorage.setItem('saleID','1')
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };


  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/sales/create/', values);
      notification.success({
        message: 'Success',
        description: 'Transaction added successfully!',
      });
      fetchData();
    } catch (error) {
      console.error('Error adding transaction:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to add transaction.',
      });
    }
    setLoading(false);
  };

  const searchProduct = async (values) => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products/'+values+'/');
      setProdData(response.data);
      if (Object.keys(response.data).length > 0) {
        notification.success({
          message: 'Success',
          description: 'Product Found '+response.data.PRODUCT_NAME+'!',
        });
      }
      console.log(response.data)
    } catch (error) {
      console.error('Error adding transaction:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to Find Product.',
      });
    }
    setLoading(false);
  };
  
  return (
    <div className="product-table">
      <h1>Transaction</h1>
      <hr/>
      <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={4}>
              <Form.Item label="Transaction Code" style={{ marginBottom: '-35px' }}>
              </Form.Item>
            </Col>
            <Col xs={24} md={20}>
              <AntInput 
                value={saleID}
                readOnly={true}
              />
            </Col>
            <Col xs={24} md={4}>
              <Form.Item label="Transaction Date" 
              name="SALE_DATE"
              rules={[{ required: true, message: 'Please input transaction date!' }]}
              style={{ marginBottom: '-35px' }}>
              </Form.Item>
            </Col>
            <Col xs={24} md={20}>
              <AntInput 
                type='date'
              />
            </Col>
            <Col xs={24} md={4}>
              <Form.Item label="Customer" 
              name="CUSTOMER_ID"
              rules={[{ required: true, message: 'Please select the customer!' }]}
              style={{ marginBottom: '-35px' }}>
              </Form.Item>
            </Col>
            <Col xs={24} md={20}>
              <Select placeholder="Select Customer" style={{width:'100%'}}>
                {customerData.map((customer) => (
                  <Option key={customer.CUSTOMER_ID} value={customer.CUSTOMER_ID}>
                    {customer.CUSTOMER_NAME}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item 
              label="Product"
              style={{ marginBottom: '-35px' }}>
              </Form.Item>
            </Col>
            <Col xs={24} md={20}>
              <AntInput
                  placeholder='Search Product By Product Code Here..'
                  onChange={(e) => searchProduct(e.target.value)}
                />
            </Col>
            <Col xs={24} md={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add Product
                </Button>
              </Form.Item>
            </Col>
          </Row>
      </Form>
    </div>
  );
};

export default Transaction;
