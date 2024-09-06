import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Input, Modal, Form, Input as AntInput, Button, Popconfirm, notification, Spin } from 'antd';
import { Link } from 'react-router-dom';
import '../styles/TransactionHistoryTable.css';

const { Search } = Input;

const TransactionHistoryTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/sales/?page=${pagination.current}&page_size=${pagination.pageSize}`);
      setDataSource(response.data.results);
      setFilteredData(response.data.results);
      setPagination(prev => ({
        ...prev,
        total: response.data.count
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleSearch = (value) => {
    if (value) {
      const filtered = dataSource.filter(item =>
        item.transactionCode.toLowerCase().includes(value.toLowerCase()) ||
        item.customer.toLowerCase().includes(value.toLowerCase())
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
      await axios.post('http://127.0.0.1:8000/api/sales/create/', values);
      notification.success({
        message: 'Success',
        description: 'Transaction added successfully!',
      });
      fetchData();
      handleModalCancel(); // Close modal on success
    } catch (error) {
      console.error('Error adding transaction:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to add transaction.',
      });
    }
    setLoading(false);
  };

  const handleEditClick = async (record) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/sales/${record.key}/`);
      setEditingTransaction(response.data);
      form.setFieldsValue(response.data);
      setIsEditModalVisible(true);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch transaction details.',
      });
    }
    setLoading(false);
  };

  const handleEditFormSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.put(`http://127.0.0.1:8000/api/sales/update/${editingTransaction.id}/`, values);
      notification.success({
        message: 'Success',
        description: 'Transaction updated successfully!',
      });
      fetchData();
      setIsEditModalVisible(false); // Close modal on success
    } catch (error) {
      console.error('Error updating transaction:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update transaction.',
      });
    }
    setLoading(false);
  };

  const handleDelete = async (transactionId) => {
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/sales/delete/${transactionId}/`);
      notification.success({
        message: 'Success',
        description: 'Transaction deleted successfully!',
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete transaction.',
      });
    }
    setLoading(false);
  };

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize
    });
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Transaction Code',
      dataIndex: 'transactionCode',
      key: 'transactionCode',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Total Items',
      dataIndex: 'totalItems',
      key: 'totalItems',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button onClick={() => handleEditClick(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this transaction?"
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
    <div className="transaction-table">
      <Button type="primary" style={{ marginBottom: 16 }}>
        <Link to="/transaction">Add Transaction</Link>
      </Button>
      <Search
        placeholder="Search by code or customer"
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      {loading ? (
        <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 50 }} />
      ) : (
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={pagination}
          onChange={handleTableChange}
          rowKey="key"
        />
      )}

      <Modal
        title="Add Transaction"
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
            name="transactionCode"
            label="Transaction Code"
            rules={[{ required: true, message: 'Please input the transaction code!' }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="customer"
            label="Customer"
            rules={[{ required: true, message: 'Please input the customer name!' }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="totalItems"
            label="Total Items"
            rules={[{ required: true, message: 'Please input the total items!' }]}
          >
            <AntInput type="number" />
          </Form.Item>
          <Form.Item
            name="totalPrice"
            label="Total Price"
            rules={[{ required: true, message: 'Please input the total price!' }]}
          >
            <AntInput type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Transaction
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Transaction"
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
            name="transactionCode"
            label="Transaction Code"
            rules={[{ required: true, message: 'Please input the transaction code!' }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="customer"
            label="Customer"
            rules={[{ required: true, message: 'Please input the customer name!' }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="totalItems"
            label="Total Items"
            rules={[{ required: true, message: 'Please input the total items!' }]}
          >
            <AntInput type="number" />
          </Form.Item>
          <Form.Item
            name="totalPrice"
            label="Total Price"
            rules={[{ required: true, message: 'Please input the total price!' }]}
          >
            <AntInput type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Transaction
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TransactionHistoryTable;
