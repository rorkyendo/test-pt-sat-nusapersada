import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Input, Button, Popconfirm, notification, Spin } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import '../styles/TransactionHistoryTable.css';

const { Search } = Input;

const TransactionHistoryTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, searchKeyword, startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/sales/`, {
        params: {
          keyword: searchKeyword,
          data_periode_start: startDate,
          data_periode_end: endDate,
          total_data_show: pagination.pageSize,
          page: pagination.current
        }
      });

      const formattedData = response.data.data.map(item => ({
        ...item,
        SALE_DATE: moment(item.SALE_DATE).format('DD/MM/YYYY') // Format tanggal dengan Moment.js
      }));

      setDataSource(formattedData);
      setPagination(prev => ({
        ...prev,
        total: response.data.total_data,
        totalPage: response.data.total_page
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleSearch = (value) => {
    setSearchKeyword(value);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page on search
  };

  const handleDateChange = (dateRange) => {
    const [start, end] = dateRange || [];
    setStartDate(start ? start.format('YYYY-MM-DD') : ''); // Format tanggal untuk API
    setEndDate(end ? end.format('YYYY-MM-DD') : '');
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page on date change
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
      current: pagination.current
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
      dataIndex: 'SALE_ID',
      key: 'SALE_ID',
    },
    {
      title: 'Sale Date',
      dataIndex: 'SALE_DATE',
      key: 'SALE_DATE',
    },
    {
      title: 'Customer',
      dataIndex: 'CUSTOMER_NAME',
      key: 'CUSTOMER_NAME',
    },
    {
      title: 'Total Items',
      dataIndex: 'SALE_ITEMS_TOTAL',
      key: 'SALE_ITEMS_TOTAL',
    },
    {
      title: 'Total Price',
      dataIndex: 'TOTAL_PRICE',
      key: 'TOTAL_PRICE',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Popconfirm
            title="Are you sure you want to delete this transaction?"
            onConfirm={() => handleDelete(record.SALE_ID)}
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
      {/* Date picker component here */}
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize }),
          pageSizeOptions: ['10', '20', '50', '100'], // Options to select number of rows per page
          showSizeChanger: true, // Show page size changer
          showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`, // Display total entries
        }}
        rowKey="SALE_ID"
      />
      {loading && <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 50 }} />}
    </div>
  );
};

export default TransactionHistoryTable;
