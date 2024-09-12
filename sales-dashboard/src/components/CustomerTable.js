import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, addCustomer, editCustomer, deleteCustomer } from '../redux/actions/cutsomerActions';
import { Table, Input, Input as AntInput, Modal, Form, Button, Select, Popconfirm, Spin, notification } from 'antd';
import '../styles/ProductsTable.css';

const { Search } = Input;

const CustomerTable = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector(state => state.customerState);

  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(customers);
  }, [customers]);

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
    dispatch(addCustomer(values));
    handleModalCancel();
  };

  const handleEditClick = async (record) => {
    setEditingCustomer(record);
    form.setFieldsValue({
      CUSTOMER_NAME: record.customerName,
    });
    setIsEditModalVisible(true);
  };

  const handleEditFormSubmit = async (values) => {
    dispatch(editCustomer(editingCustomer.key, values));
    setIsEditModalVisible(false);
  };

  const handleDelete = (customerId) => {
    dispatch(deleteCustomer(customerId));
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