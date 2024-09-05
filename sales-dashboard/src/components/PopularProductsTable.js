import React from 'react';
import { Table } from 'antd';
import '../styles/PopularProductsTable.css';

const dataSource = [
  {
    key: '1',
    name: 'Iphone 14 Pro',
    price: 'Rp. 1.107.942.900',
    qty: 100,
    total: 'Rp. 1.107.942.900',
  },
  {
    key: '2',
    name: 'Iphone 15 Pro',
    price: 'Rp. 1.012.918.650',
    qty: 75,
    total: 'Rp. 1.012.918.650',
  },
  {
    key: '3',
    name: 'Asus TUF Gaming AX4200',
    price: 'Rp. 621.307.600',
    qty: 50,
    total: 'Rp. 621.307.600',
  },
];

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
  },
  {
    title: 'Total Qty',
    dataIndex: 'qty',
    key: 'qty',
  },
  {
    title: 'Total Price',
    dataIndex: 'total',
    key: 'total',
  },
];

const PopularProductsTable = () => {
  return (
    <div className="products-table">
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};

export default PopularProductsTable;
