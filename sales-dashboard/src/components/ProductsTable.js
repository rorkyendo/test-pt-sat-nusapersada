import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct, editProduct, deleteProduct } from '../redux/actions/productActions';
import { Table, Input, Input as AntInput, Modal, Form, Button, Select, Popconfirm, Spin, notification } from 'antd';
import '../styles/ProductsTable.css';

const { Search } = Input;
const { Option } = Select;

const ProductsTable = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(state => state.productsState);

  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setFilteredData(products);
  }, [products]);

  const handleSearch = (value) => {
    setSearchText(value);
    if (value) {
      const filtered = products.filter(item =>
        item.productCode.toLowerCase().includes(value.toLowerCase()) ||
        item.productName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(products);
    }
  };

  const handleAddClick = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleFormSubmit = (values) => {
    dispatch(addProduct(values));
    handleModalCancel();
  };

  const handleEditClick = (record) => {
    setEditingProduct(record);
    const cleanValue = record.productPrice.replace("Rp. ","")
    const cleanValue2 = cleanValue.replace(",","")
    form.setFieldsValue({
      PRODUCT_CODE: record.productCode,
      PRODUCT_NAME: record.productName,
      PRODUCT_PRICE: cleanValue2,
      PRODUCT_STATUS: record.productStatus,
      PRODUCT_STOCK: record.productStock,
    });
    setIsEditModalVisible(true);
  };

  const handleEditFormSubmit = (values) => {
    dispatch(editProduct(editingProduct.key, values));
    setIsEditModalVisible(false);
  };

  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId));
  };

  const columns = [
    { title: 'No', dataIndex: 'key', key: 'key' },
    { title: 'Product Code', dataIndex: 'productCode', key: 'productCode' },
    { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
    { title: 'Price', dataIndex: 'productPrice', key: 'productPrice' },
    { title: 'Stock', dataIndex: 'productStock', key: 'productStock' },
    { title: 'Status', dataIndex: 'productStatus', key: 'productStatus' },
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
      <Button type="primary" onClick={handleAddClick} style={{ marginBottom: 16 }}>Add Product</Button>
      <Search placeholder="Search by code or name" onSearch={handleSearch} onChange={(e) => handleSearch(e.target.value)} style={{ marginBottom: 16 }} />
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
