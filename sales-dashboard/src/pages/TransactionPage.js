import React from 'react';
import { Layout, Row, Col } from 'antd';
import Transaction from '../components/Transaction';

const { Content } = Layout;

const TransactionPage = () => (
  <Content style={{ padding: '20px' }}>
    <Row gutter={[16, 16]}>
      <Col xs={24} md={24}>
        <Transaction />
      </Col>
    </Row>
  </Content>
);

export default TransactionPage;
