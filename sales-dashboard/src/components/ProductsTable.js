import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import '../styles/ProductsTable.css';

const ProductsTable = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/');
        console.log('Data fetched:', response.data); // Log data fetched from API

        const formattedData = response.data.map(item => ({
          key: item.PRODUCT_ID,
          productCode: item.PRODUCT_CODE,
          productName: item.PRODUCT_NAME,
          productPrice: `Rp. ${item.PRODUCT_PRICE.toLocaleString()}`,
          productStock: item.PRODUCT_STOCK
        }));

        console.log('Formatted data:', formattedData); // Log formatted data
        setDataSource(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
  ];

  return (
    <div className="product-table">
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};

export default ProductsTable;
