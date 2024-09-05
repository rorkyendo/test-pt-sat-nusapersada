import React from 'react';
import { Layout, Row, Col } from 'antd';
import ProductsTable from '../components/ProductsTable';

const { Content } = Layout;

const SalesPage = () => (
  <Content style={{ padding: '20px' }}>
    <Row gutter={[16, 16]}>
      <Col xs={24} md={24}>
        <ProductsTable />
      </Col>
    </Row>
  </Content>
);

export default SalesPage;
