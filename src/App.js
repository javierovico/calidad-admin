import {BrowserRouter} from 'react-router-dom';
import AuthProvider from "./context/AuthProvider";
import Routes from './router';
import React, {useState} from "react";
// zona de menus
import './App.css'
import { Layout, Menu, Breadcrumb } from 'antd';
import {AiFillMail,AiOutlineBorderlessTable} from 'react-icons/ai'
const { SubMenu } = Menu;
const { Header, Content, Sider, Footer} = Layout;



function App() {
    // const current = 'mail'
    // const handleClick = ()=>{}
    const [collapsed,setCollapsed] = useState(true)
    return (
        <BrowserRouter>
            <AuthProvider>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider breakpoint="lg" collapsedWidth="0" collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                        <div className="logo" />
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1" icon={<AiFillMail />}>
                                Option 1
                            </Menu.Item>
                            <Menu.Item key="2" icon={<AiFillMail />}>
                                Option 2
                            </Menu.Item>
                            <SubMenu key="sub1" icon={<AiOutlineBorderlessTable />} title="User">
                                <Menu.Item key="3">Tom</Menu.Item>
                                <Menu.Item key="4">Bill</Menu.Item>
                                <Menu.Item key="5">Alex</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" icon={<AiOutlineBorderlessTable />} title="Team">
                                <Menu.Item key="6">Team 1</Menu.Item>
                                <Menu.Item key="8">Team 2</Menu.Item>
                            </SubMenu>
                            <Menu.Item key="9" icon={<AiOutlineBorderlessTable />}>
                                Files
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout className="site-layout">
                        <Header className="site-layout-background" style={{ padding: 0 }} />
                        <Content style={{ margin: '0 16px' }}>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>User</Breadcrumb.Item>
                                <Breadcrumb.Item>Bill</Breadcrumb.Item>
                            </Breadcrumb>
                            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                                <Routes/>
                            </div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                    </Layout>
                </Layout>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
