import React from 'react'
import { Outlet } from 'react-router-dom'
import Toast from './Toast'

const Layout = () => {
    return (
        <>
            <Toast />
            <Outlet />
        </>
    )
}

export default Layout