import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';
import '../styles/PopularProductsTable.css';

const PopularProductsTable = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/popular/');
        if (response.data && response.data.data) {
          setDataSource(response.data.data.map((item, index) => ({ ...item, key: index + 1 })));
        }
      } catch (error) {
        console.error('Error fetching popular products:', error);
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
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: price => `Rp. ${price.toLocaleString()}`, // Format price
    },
    {
      title: 'Total Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Total Price',
      dataIndex: 'total_price',
      key: 'total_price',
      render: total => `Rp. ${total.toLocaleString()}`, // Format total price
    },
  ];

  return (
    <div className="products-table">
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

export default PopularProductsTable;
