import {BrowserRouter} from 'react-router-dom';
import AuthProvider from "./context/AuthProvider";
import Routes from './router';
import React from "react";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes/>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
