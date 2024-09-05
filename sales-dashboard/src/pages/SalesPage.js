import React from 'react';
import { Layout, Row, Col } from 'antd';
import SalesComparisonChart from '../components/SalesComparisonChart';
import PopularProductsTable from '../components/PopularProductsTable';
import TransactionHistoryTable from '../components/TransactionHistoryTable';

const { Content } = Layout;

const SalesPage = () => (
  <Content style={{ padding: '20px' }}>
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <SalesComparisonChart />
        <PopularProductsTable />
      </Col>
      <Col xs={24} md={16}>
        <TransactionHistoryTable />
      </Col>
    </Row>
  </Content>
);

export default SalesPage;
