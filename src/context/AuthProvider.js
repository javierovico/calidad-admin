import React, {useEffect, useState} from 'react';
import axios from 'axios';
import User from '../modelos/User';
import RolApi from "../modelos/Acceso/RolApi";
import DatosUser from "../modelos/DatosUser";

export const AuthContext = React.createContext();

const fakeUserData = {
    id: 1,
    name: 'Jhon Doe',
    avatar: '',
    roles: ['USER', 'ADMIN'],
};

/**
 * We have used Fake JWT token from "jwt.io"
 * This is a sample token to show auth is working
 * Your token will come from your server when user successfully loggedIn.
 */

const fakeToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoidGFyZXEgam9iYXllcmUiLCJyb2xlcyI6ImFkbWluIn0.k74_B-zeWket405dIAt018mnQFMh_6_BTFpjB77HtRQ';

const addItem = (key, value = '') => {
    if (key) localStorage.setItem(key, value);
};

const clearItem = key => {
    localStorage.removeItem(key);
};

const isValidToken = () => {
    const token = localStorage.getItem('token');
    if (token) return true;
    return false;
};

const getToken = () => {
    const token = localStorage.getItem('token');
    return token ? token : null;
}

const AuthProvider = props => {
    const [loggedIn, setLoggedIn] = useState(isValidToken());
    // const [loggedOut, setLoggedOut] = useState(true);
    const [user, setUser] = useState(new User());
    const [token, setToken] = useState(getToken);
    const [datosUser,setDatosUser] = useState(new DatosUser())

    /** Establece el token en el axio*/
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        }else{
            axios.defaults.headers.common['Authorization'] = '';
        }
    },[token])

    const signIn = params => {
        return new Promise((resolve, reject) => {
            /**
             * Make post request here to authenticate with fetch
             * if returns true then change the state
             */
            console.log(params, 'sign in form Props');
            axios({
                url: User.URL_LOGIN,
                method: 'POST',
                data: params,
            })
                .then(({data}) => {
                    const {access_token} = data;
                    setToken(access_token);
                    addItem('token', access_token);
                    setLoggedIn(true);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };
    const signUp = params => {
        console.log(params, 'sign up form Props');
        setUser(fakeUserData);
        setToken(fakeToken);
        addItem('token', fakeToken);
        setLoggedIn(true);
    };

    /**
     * For 3rd-party Authentication [e.g. Autho0, firebase, AWS etc]
     *
     */
    const tokenAuth = (token, user = {}) => {
        setUser(user);
        setToken(token);
        addItem('token', token);
        setLoggedIn(true);
    };

    const forgetPass = params => {
        console.log(params, 'forget password form Props');
    };
    const changePass = params => {
        console.log(params, 'change password form Props');
    };

    const logOut = () => {
        setUser(null);
        setToken(null);
        clearItem('token');
        setLoggedIn(false);
    };

    /** Si se deslogguea o se loguea, acutliza los datos del usuario logueado */
    useEffect(()=>{
        if(loggedIn){
            axios({
                url: User.URL_DESCARGA
            }).then(({data})=>{
                setUser(new User(data))
            }).catch(e=>{
                /** Fallo en el logueo*/
                logOut()
            })
            axios({
                url: DatosUser.URL_DESCARGA
            }).then(({data})=>{
                setDatosUser(new DatosUser(data))
            }).catch(e=>{
                /** Fallo en el logueo*/
                logOut()
            })
        }
    },[loggedIn])

    return (
        <AuthContext.Provider
            value={{
                loggedIn,
                logOut,
                signIn,
                signUp,
                forgetPass,
                changePass,
                tokenAuth,
                user,
                token,
                datosUser,
            }}
        >
            <>{props.children}</>
        </AuthContext.Provider>
    );
};

export default AuthProvider;
