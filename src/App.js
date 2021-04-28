import {Link} from 'react-router-dom';
import Routes, {routes} from './router';
import React, {useContext} from "react";
//router
import {useLocation} from 'react-router-dom';
import {AiFillCaretDown} from 'react-icons/ai';

// zona de menus
import './App.css'
import {Dropdown,Layout, Menu, Breadcrumb} from 'antd';
import {Row,Col} from "antd";
import {AuthContext} from "./context/AuthProvider";
const { SubMenu } = Menu;
const {Header, Content, Footer} = Layout;



function App() {
    const location = useLocation();
    const {search,pathname} = location
    const menus = routes
    const {user, loggedIn, logOut} = useContext(AuthContext)
    const menuUsuario = (
        <Menu>
            <Menu.Item key='cerrar-sesion'>
                { loggedIn && <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com" onClick={(e)=>{
                    e.preventDefault()
                    logOut()
                }}>
                    Cerrar Sesion
                </a>}
            </Menu.Item>
        </Menu>
    );
    return (
        <Layout className="layout">
            <Header>
                <div className="logo"/>
                <Row justify="space-between">
                    <Col span={16}>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            selectedKeys={[pathname]}
                        >
                            {menus.map(m =>
                                m.hijos?.length ?
                                    <SubMenu key={m.nombre} title={m.nombre}>
                                        {m.hijos.map(h=>
                                            <Menu.Item key={m.link+h.link}><Link to={{pathname:m.link + h.link, search}}>{h.nombre}</Link></Menu.Item>
                                        )}
                                    </SubMenu> :
                                    <Menu.Item key={m.link}><Link to={m.link}>{m.nombre}</Link></Menu.Item>
                            )}
                        </Menu>
                    </Col>
                    <Col span={8}>
                        {loggedIn && user && <Dropdown overlay={menuUsuario}>
                            <a href={'no'} className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{float:'right'}}>
                                {user.user}<AiFillCaretDown />
                            </a>
                        </Dropdown>}
                    </Col>
                </Row>
            </Header>
            <Content style={{padding: '0 50px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    <Routes/>
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>
                Ant Design ©2018 Created by Ant UED
            </Footer>
        </Layout>
    );
}

export default App;
