import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Input, Modal, Form, Input as AntInput, Button, Popconfirm, Spin, notification } from 'antd';
import '../styles/ProductsTable.css';

const { Search } = Input;

const CustomerTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/customers/');
      const formattedData = response.data.data.map(item => ({
        key: item.CUSTOMER_ID,
        customerName: item.CUSTOMER_NAME
      }));
      setDataSource(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const filtered = dataSource.filter(item =>
        item.customerName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(dataSource);
    }
  };

  const handleAddClick = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/customers/create/', values);
      notification.success({
        message: 'Success',
        description: 'Customer added successfully!',
      });
      fetchData();
      handleModalCancel(); // Close modal on success
    } catch (error) {
      console.error('Error adding customer:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to add customer.',
      });
    }
    setLoading(false);
  };

  const handleEditClick = async (record) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/customers/${record.key}/`);
      setEditingCustomer(response.data.data);
      form.setFieldsValue({
        CUSTOMER_NAME: response.data.data.CUSTOMER_NAME,
      });
      setIsEditModalVisible(true);
    } catch (error) {
      console.error('Error fetching customer details:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch customer details.',
      });
    }
    setLoading(false);
  };

  const handleEditFormSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.put(`http://127.0.0.1:8000/api/customers/update/${editingCustomer.CUSTOMER_ID}/`, values);
      notification.success({
        message: 'Success',
        description: 'Customer updated successfully!',
      });
      fetchData();
      setIsEditModalVisible(false); // Close modal on success
    } catch (error) {
      console.error('Error updating customer:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update customer.',
      });
    }
    setLoading(false);
  };

  const handleDelete = async (customerId) => {
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/customers/delete/${customerId}/`);
      notification.success({
        message: 'Success',
        description: 'Customer deleted successfully!',
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting customer:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete customer.',
      });
    }
    setLoading(false);
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button onClick={() => handleEditClick(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this customer?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className="customer-table">
      <Button type="primary" onClick={handleAddClick} style={{ marginBottom: 16 }}>
        Add Customer
      </Button>
      <Search
        placeholder="Search by name"
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      {loading ? (
        <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 50 }} />
      ) : (
        <Table dataSource={filteredData} columns={columns} pagination={false} />
      )}

      <Modal
        title="Add Customer"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="CUSTOMER_NAME"
            label="Customer Name"
            rules={[{ required: true, message: 'Please input the customer name!' }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Customer
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Customer"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditFormSubmit}
        >
          <Form.Item
            name="CUSTOMER_NAME"
            label="Customer Name"
            rules={[{ required: true, message: 'Please input the customer name!' }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerTable;