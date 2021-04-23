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
import {parseParams,setParams} from "./utils/Utils";
import EllipsisText from "react-ellipsis-text";
// import {AiFillMail,AiOutlineBorderlessTable} from 'react-icons/ai'
const { SubMenu } = Menu;
const {Header, Content, Footer} = Layout;



function App() {
    const location = useLocation();
    const {datosUser,empresaSeleccionada, sucursalesSeleccionables, sucursalSeleccionada} = useContext(AuthContext);
    const {empresas} = datosUser
    const {search,pathname} = location
    const menus = routes
    // console.log(location)
    const menuEmpresa = (
        <Menu>
            {empresas.map(e=>
                <Menu.Item key={e.idDelivery}>
                    <Link to={{pathname,search:setParams({...parseParams(search),empresa_id:e.idDelivery,sucursal_id:null})}}>
                        {e.clienteDeliv}
                    </Link>
                </Menu.Item>
            )}
        </Menu>
    );
    const menuSucursal = (
        <Menu>
            {sucursalesSeleccionables.map(e=>
                <Menu.Item key={e.IdSucursal}>
                    <Link to={{pathname,search:setParams({...parseParams(search),sucursal_id:e.IdSucursal})}}>
                        {e.sucursal}
                    </Link>
                </Menu.Item>
            )}
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
                        {sucursalesSeleccionables.length > 0 && <Dropdown overlay={menuSucursal} trigger={['click']}>
                            <a href={'no'} className="ant-dropdown-link" onClick={e => e.preventDefault()}
                               style={{float: 'right'}}>
                                {sucursalSeleccionada ? <EllipsisText text={sucursalSeleccionada.sucursal.replace(/^sucursal /i,'')} length={15} /> : 'Sucursales'} <AiFillCaretDown/>
                            </a>
                        </Dropdown>}
                        <Dropdown overlay={menuEmpresa} trigger={['click']}>
                            <a href={'no'} className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{float:'right'}}>
                                {empresaSeleccionada?<EllipsisText text={empresaSeleccionada.clienteDeliv} length={15} />:'Empresas'} <AiFillCaretDown />
                            </a>
                        </Dropdown>
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
