import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {ERROR_CODE_NO_AUTENTICADO} from "../settings/constant";
import User from "../modelos/User";

export const AuthContext = React.createContext();

const addItem = (key, value = '') => {
    if (key) localStorage.setItem(key, value);
};

const clearItem = key => {
    localStorage.removeItem(key);
};

const isValidToken = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

const getToken = () => {
    const token = localStorage.getItem('token');
    return token ? token : null;
}

const AuthProvider = props => {
    const [loggedIn, setLoggedIn] = useState(isValidToken());
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(getToken);

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
                url: User.URL_DESCARGA + '?XDEBUG_SESSION_START=PHPSTORM'
            }).then(({data})=>{
                setUser(new User(data))
            }).catch(()=>{
                /** Fallo en el logueo*/
                logOut()
            })
        }
    },[loggedIn])

    const analizarError = (error) =>{
        switch (error?.response?.data?.errorCode){
            case ERROR_CODE_NO_AUTENTICADO:
                logOut()
                break;
            default:
                break;
        }
    }

    return (
        <AuthContext.Provider
            value={{
                loggedIn,
                logOut,
                signIn,
                forgetPass,
                changePass,
                user,
                token,
                analizarError,
            }}
        >
            <>{props.children}</>
        </AuthContext.Provider>
    );
};

export default AuthProvider;
