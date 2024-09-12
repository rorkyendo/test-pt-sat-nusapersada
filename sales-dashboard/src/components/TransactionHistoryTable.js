import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSales, deleteSale } from '../redux/actions/saleActions';
import { Table, Input, Button, Popconfirm, notification, Spin } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import '../styles/TransactionHistoryTable.css';

const { Search } = Input;

const TransactionHistoryTable = () => {
  const dispatch = useDispatch();
  const { sales, total, loading } = useSelector(state => ({
    sales: state.saleState.sales,
    total: state.saleState.total,
    loading: state.saleState.loading,
  }));
  
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, searchKeyword, startDate, endDate]);

  const fetchData = () => {
    dispatch(fetchSales({
      keyword: searchKeyword,
      data_periode_start: startDate,
      data_periode_end: endDate,
      total_data_show: pagination.pageSize,
      page: pagination.current
    })).catch((error) => {
      notification.error({
        message: 'Error',
        description: error.message || 'Error fetching data',
      });
    });
  };

  const handleSearch = (value) => {
    setSearchKeyword(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleDateChange = (dateRange) => {
    const [start, end] = dateRange || [];
    setStartDate(start ? start.format('YYYY-MM-DD') : '');
    setEndDate(end ? end.format('YYYY-MM-DD') : '');
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleDelete = (transactionId) => {
    dispatch(deleteSale(transactionId)).then(() => {
      notification.success({
        message: 'Success',
        description: 'Transaction deleted successfully!',
      });
    }).catch((error) => {
      notification.error({
        message: 'Error',
        description: 'Failed to delete transaction.',
      });
    });
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'key',
      key: 'key',
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
      <Table
        dataSource={sales.map(item => ({
          ...item,
          SALE_DATE: moment(item.SALE_DATE).format('DD/MM/YYYY')
        }))}
        columns={columns}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total,
          onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize }),
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
        }}
        rowKey="SALE_ID"
      />
      {loading && <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 50 }} />}
    </div>
  );
};

export default TransactionHistoryTable;
