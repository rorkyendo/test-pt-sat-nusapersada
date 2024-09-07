import React from 'react';
import { Layout, Row, Col } from 'antd';
import CustomerTable from '../components/CustomerTable';

const { Content } = Layout;

const CustomerPage = () => (
  <Content style={{ padding: '20px' }}>
    <Row gutter={[16, 16]}>
      <Col xs={24} md={24}>
        <CustomerTable />
      </Col>
    </Row>
  </Content>
);

export default CustomerPage;
