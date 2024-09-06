import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Input, Modal, Form, Input as AntInput, Button, Select, Popconfirm, Spin, notification } from 'antd';
import '../styles/ProductsTable.css';

const { Search } = Input;
const { Option } = Select;

const ProductsTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products/');
      const formattedData = response.data.data.map(item => ({
        key: item.PRODUCT_ID,
        productCode: item.PRODUCT_CODE,
        productName: item.PRODUCT_NAME,
        productPrice: `Rp. ${item.PRODUCT_PRICE.toLocaleString()}`,
        productStock: item.PRODUCT_STOCK,
        productStatus: item.PRODUCT_STATUS
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
        item.productCode.toLowerCase().includes(value.toLowerCase()) ||
        item.productName.toLowerCase().includes(value.toLowerCase())
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
      await axios.post('http://127.0.0.1:8000/api/products/create/', values);
      notification.success({
        message: 'Success',
        description: 'Product added successfully!',
      });
      fetchData();
      handleModalCancel(); // Close modal on success
    } catch (error) {
      console.error('Error adding product:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to add product.',
      });
    }
    setLoading(false);
  };

  const handleEditClick = async (record) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/products/${record.key}/`);
      setEditingProduct(response.data.data);
      form.setFieldsValue({
        PRODUCT_CODE: response.data.data.PRODUCT_CODE,
        PRODUCT_NAME: response.data.data.PRODUCT_NAME,
        PRODUCT_PRICE: response.data.data.PRODUCT_PRICE,
        PRODUCT_STATUS: response.data.data.PRODUCT_STATUS,
        PRODUCT_STOCK: response.data.data.PRODUCT_STOCK,
      });
      setIsEditModalVisible(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch product details.',
      });
    }
    setLoading(false);
  };

  const handleEditFormSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.put(`http://127.0.0.1:8000/api/products/update/${editingProduct.PRODUCT_ID}/`, values);
      notification.success({
        message: 'Success',
        description: 'Product updated successfully!',
      });
      fetchData();
      setIsEditModalVisible(false); // Close modal on success
    } catch (error) {
      console.error('Error updating product:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update product.',
      });
    }
    setLoading(false);
  };

  const handleDelete = async (productId) => {
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/delete/${productId}/`);
      notification.success({
        message: 'Success',
        description: 'Product deleted successfully!',
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete product.',
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
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Price',
      dataIndex: 'productPrice',
      key: 'productPrice',
    },
    {
      title: 'Stock',
      dataIndex: 'productStock',
      key: 'productStock',
    },
    {
      title: 'Status',
      dataIndex: 'productStatus',
      key: 'productStatus',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button onClick={() => handleEditClick(record)} style={{ marginRight: 8 }}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
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
    <div className="product-table">
      <Button type="primary" onClick={handleAddClick} style={{ marginBottom: 16 }}>
        Add Product
      </Button>
      <Search
        placeholder="Search by code or name"
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
        title="Add Product"
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
            name="PRODUCT_CODE"
            label="Product Code"
            rules={[{ required: true, message: 'Please input the product code!' }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="PRODUCT_NAME"
            label="Product Name"
            rules={[{ required: true, message: 'Please input the product name!' }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="PRODUCT_PRICE"
            label="Product Price"
            rules={[{ required: true, message: 'Please input the product price!' }]}
          >
            <AntInput type="number" />
          </Form.Item>
          <Form.Item
            name="PRODUCT_STATUS"
            label="Product Status"
            rules={[{ required: true, message: 'Please select the product status!' }]}
          >
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="hold">Hold</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="PRODUCT_STOCK"
            label="Product Stock"
            rules={[{ required: true, message: 'Please input the product stock!' }]}
          >
            <AntInput type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Product"
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
            name="PRODUCT_CODE"
            label="Product Code"
            rules={[{ required: true, message: 'Please input the product code!' }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="PRODUCT_NAME"
            label="Product Name"
            rules={[{ required: true, message: 'Please input the product name!' }]}
          >
            <AntInput />
          </Form.Item>
          <Form.Item
            name="PRODUCT_PRICE"
            label="Product Price"
            rules={[{ required: true, message: 'Please input the product price!' }]}
          >
            <AntInput type="number" />
          </Form.Item>
          <Form.Item
            name="PRODUCT_STATUS"
            label="Product Status"
            rules={[{ required: true, message: 'Please select the product status!' }]}
          >
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="hold">Hold</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="PRODUCT_STOCK"
            label="Product Stock"
            rules={[{ required: true, message: 'Please input the product stock!' }]}
          >
            <AntInput type="number" />
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

export default ProductsTable;
