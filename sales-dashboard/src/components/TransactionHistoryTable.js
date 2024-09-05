import React from 'react';
import { Table } from 'antd';
import '../styles/TransactionHistoryTable.css';

const dataSource = [
  {
    key: '1',
    transactionCode: 'ID0003036',
    customer: 'Xiaomi',
    totalItems: 1,
    totalPrice: 'Rp. 2.000.000',
  },
  {
    key: '2',
    transactionCode: 'ID0003035',
    customer: 'Asus',
    totalItems: 1,
    totalPrice: 'Rp. 7.000.000',
  },
  {
    key: '3',
    transactionCode: 'ID0003034',
    customer: 'Apple',
    totalItems: 2,
    totalPrice: 'Rp. 24.000.000',
  },
];

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
    title: 'Total Item',
    dataIndex: 'totalItems',
    key: 'totalItems',
  },
  {
    title: 'Total Price',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
  },
];

const TransactionHistoryTable = () => {
  return (
    <div className="transaction-table">
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};

export default TransactionHistoryTable;
