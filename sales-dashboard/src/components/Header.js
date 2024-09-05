import React from 'react';
import { Layout, Menu, Avatar, Row, Col } from 'antd';
import { UserOutlined, LineChartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import '../styles/Header.css'; // Import CSS khusus untuk header

const { Header } = Layout;

const CustomHeader = () => {
  return (
    <Header className="custom-header">
      <Row align="middle" className="header-row">
        <Col flex="none">
          {/* Logo dan Title */}
          <div className="logo-section">
            <LineChartOutlined className="logo-icon" />
            <span className="logo-title">Sales</span>
          </div>
        </Col>
        <Col flex="auto">
          {/* Menu */}
          <Menu mode="horizontal" defaultSelectedKeys={['sales']} className="menu">
            <Menu.Item key="sales">
              <Link to="/sales">Sales</Link>
            </Menu.Item>
            <Menu.Item key="report">
              <Link to="/report">Report</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col flex="none" className="user-profile-col">
          {/* User Profile */}
          <div className="user-profile">
            <span>Febby Fakhrian</span>
            <Avatar icon={<UserOutlined />} className="avatar" />
          </div>
        </Col>
      </Row>
    </Header>
  );
};

export default CustomHeader;
