import React, {useContext} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
// import Loadable from 'react-loadable';
import loadable from "@loadable/component";
import {AuthContext} from './context/AuthProvider';
import {
    HOME_PAGE,
    LOGIN_PAGE,
} from './settings/constant';
import {Col, Row} from "antd";

/**
 *
 * Public Routes
 *
 */
const Loading = () => <p>...Cargando</p>;

const routes = [
    {
        path: HOME_PAGE,
        component: loadable(() => import('./container/Home/Home'), {
            fallback: <Loading/>
        }),
        exact: true,
    },
];

const NotFound = loadable(() =>
        import('./container/404/404'), {
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
        <Row justify={'center'}>
            <Col span={18}>
                <Switch>
                    {routes.map(({path, component, exact = false}) => (
                        <ProtectedRoute key={path} path={path} exact={exact} component={component}/>
                    ))}
                    <Route component={SignIn} path={LOGIN_PAGE} exact={true}/>
                    <Route component={NotFound}/>
                </Switch>
            </Col>
        </Row>
    );
};

export default Routes;
