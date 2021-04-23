import React, {useContext} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
// import Loadable from 'react-loadable';
import loadable from "@loadable/component";
import {AuthContext} from './context/AuthProvider';
import {
    HOME_PAGE,
    LOGIN_PAGE,
} from './settings/constant';
// import {Col, Row} from "antd";

/**
 *
 * Public Routes
 *
 */
const Loading = () => <p>...Cargando</p>;

export const routes = [
    {
        nombre: 'Inicio',
        link: HOME_PAGE,
        component: loadable(() => import('./container/Home/Home'), {
            fallback: <Loading/>
        }),
    },
    {
        nombre: 'Contactos',
        link: '/contactos',
        hijos:[
            {
                nombre:'Listar Contactos',
                link:'/listar',
                component: loadable(() => import('./container/Contacto/Listar'), {
                    fallback: <Loading/>
                }),
            }
        ]
    },
    {
        nombre: 'Configuracion',
        link: '/configuracion',
        permiso:null,
        nivel:null,
        tipo: 'dropdown',
        hijos: [
            {
                nombre:'Empresas',
                link:'/empresas',
                permiso:'empresa_listar',
                nivel:'general',        //'general','empresa','sucursal','any' => le dice que tiene que tener ese acceso en modo de general
                component: loadable(() => import('./container/Configuracion/Empresas'), {
                    fallback: <Loading/>
                }),
            },
            {
                nombre:'Personales',
                link:'/personales',
                permiso:'personal_listar',
                nivel:'general',        //'general','empresa','sucursal','any' => le dice que tiene que tener ese acceso en modo de general
            },
            {
                nombre:'Roles',
                link:'/roles',
                permiso:'rol_listar',
                nivel:'any',        //'general','empresa','sucursal','any' => le dice que tiene que tener ese acceso en modo de general
            },
            {
                nombre:'Caja de Lista',
                link:'/caja-lista',
                permiso:'caja_lista_listar',
                nivel:'empresa',
            },
        ]
    },
    {
        nombre: 'Usuarios',
        link:'/usuarios',
        permiso:null,
        nivel:null,
        tipo: 'dropdown',
        hijos: [
            {
                nombre:'Usuarios',
                link:'/usuarios',
                permiso:'usuario_listar',
                nivel:'any',
            },
        ]
    },
    {
        nombre: 'Clientes',
        link:'/clientes',
        permiso:null,
        nivel:null,
        tipo: 'dropdown',
        hijos: [
            {
                nombre:'Clientes',
                link:'/clientes',
                permiso:'cliente_listar',
                nivel:'empresa',
            },
        ]
    },
    {
        nombre: 'Productos',
        link:'/productos',
        permiso:null,
        nivel:null,
        tipo: 'dropdown',
        hijos: [
            {
                nombre:'Categorias',
                link:'/categorias',
                permiso:'categoria_listar',
                nivel:'sucursal',
            },
            {
                nombre:'Productos',
                link:'/productos',
                permiso:'producto_listar',
                nivel:'empresa',
            },
            {
                nombre:'Jedisoft',
                link:'/jedisoft',
                permiso:'producto_listar',
                nivel:'empresa',
            },
            {
                nombre:'Importar desde Excel',
                link:'/import-excel',
                permiso:'producto_modificar',
                nivel:'empresa',
            },
        ]
    },
];

const NotFound = loadable(() =>
        import('./container/404/404'), {
        fallback: <Loading/>
    }
);

const Todo = loadable(() =>
        import('./container/404/400'), {
        fallback: <Loading/>
    }
);

const SignIn = loadable(() =>
        import('./container/SignIn/SignIn'), {
        fallback: <Loading/>
    }
);

const ProtectedRoute = ({component: Component, ...rest}) => {
    const {loggedIn} = useContext(AuthContext);
    return (
        <Route
            render={props =>
                loggedIn ? <Component {...props} /> : <Redirect to={LOGIN_PAGE}/>
            }
            {...rest}
        />
    );
};

const Routes = () => {
    return (
        <Switch>
            {routes.map(({link= '/', component = Todo, exact = true, hijos = []}) => (
                hijos?.length?
                    hijos.map(({link: linkHijo = '/', component = Todo, exact = true, hijos = []})=>
                        <ProtectedRoute key={link+linkHijo} exact={exact} path={link+linkHijo} component={component}/>
                    ):
                <ProtectedRoute key={link} path={link} exact={exact} component={component}/>
            ))}
            <Route component={SignIn} path={LOGIN_PAGE} exact={true}/>
            <Route component={NotFound}/>
        </Switch>
    );
};

export default Routes;
