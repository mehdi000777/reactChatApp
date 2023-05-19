import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react'

const Toast = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={5000}
            closeOnClick
            theme='light'
        />
    )
}

export default Toast;