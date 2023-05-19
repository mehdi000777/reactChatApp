import React, { useRef, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRefreshMutation } from '../app/slices/authApiSlice';
import { selectCurrentToken, setCredentials } from '../app/slices/authSlice';
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';


const PersistLogin = () => {
    const token = useSelector(selectCurrentToken);
    const effectRun = useRef(false);
    const firstLogin = localStorage.getItem('firstLogin');

    const [trueSuccess, setTrueSuccess] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [refresh,
        {
            isUninitialized,
            isLoading,
            isSuccess,
        }
    ] = useRefreshMutation();

    useEffect(() => {
        if (effectRun.current === true || process.env.NODE_ENV !== 'development') {
            const verifyRefreshToken = async () => {
                try {
                    const { accessToken, user } = await refresh().unwrap();
                    dispatch(setCredentials({ accessToken, user }));
                    setTrueSuccess(true);
                } catch (error) {
                    toast.error(error?.data?.message);
                    navigate('/login');
                    <Outlet />
                }
            }

            if (!token && firstLogin) verifyRefreshToken();
            else {
                navigate('/login')
            };
        }

        return () => effectRun.current = true;

        // eslint-disable-next-line
    }, [])

    let content
    if (!firstLogin) {
        content = <Outlet />
    }
    else if (isLoading) {
        content = (
            <div className='w-full h-screen flex justify-center items-center'>
                <PulseLoader size='3rem' color='#60A5FA' />
            </div>
        )
    } else if (isSuccess && trueSuccess) {
        content = <Outlet />
    } else if (token && isUninitialized) {
        content = <Outlet />
    }

    return content;
}

export default PersistLogin;