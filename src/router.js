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
        nombre: 'PBX',
        link: '/pbx',
        hijos:[
            {
                nombre:'Registro Llamadas',
                link:'/llamadas',
                component: loadable(() => import('./container/Contacto/Listar'), {
                    fallback: <Loading/>
                }),
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
