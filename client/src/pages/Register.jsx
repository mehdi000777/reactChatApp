import React, { useEffect, useState } from 'react'
import { useRegisterMutation } from '../app/slices/authApiSlice';
import { selectCurrentToken, setCredentials } from '../app/slices/authSlice';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';


const Register = () => {
  const [register] = useRegisterMutation();

  const token = useSelector(selectCurrentToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  let canSend = [username, password].every(Boolean);

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate])

  const submitHandler = async (e) => {
    e.preventDefault();

    const toastId = toast.loading('Please waite...');
    try {
      const { accessToken, user, message } = await register({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken, user }));
      localStorage.setItem('firstLogin', true)
      setUsername('');
      setPassword('');
      navigate('/');
      toast.update(toastId, {
        isLoading: false,
        type: 'success',
        render: message,
        autoClose: 5000,
        closeOnClick: true
      });
    } catch (error) {
      toast.update(toastId, {
        isLoading: false,
        type: 'error',
        render: error?.data?.message,
        autoClose: 5000,
        closeOnClick: true
      });
    }
  }

  const usernameClass = username ? 'border' : 'border-2 border-red-200';
  const passwordClass = password ? 'border' : 'border-2 border-red-200';

  return (
    <div className='bg-blue-50 h-screen flex justify-center items-center'>
      <form className='w-64' onSubmit={submitHandler}>
        <input type="text" placeholder='username' className={`block w-full rounded-sm p-2 mb-2 ${usernameClass}`} onChange={(e) => setUsername(e.target.value)} />
        <div className='relative'>
          <input type={showPw ? 'text' : 'password'} placeholder='password' className={`block w-full rounded-sm p-2 mb-2 border ${passwordClass}`} onChange={(e) => setPassword(e.target.value)} />
          <input type="checkbox" className='absolute top-1/2 transform -translate-y-1/2 right-1' checked={showPw} onChange={() => setShowPw(!showPw)} />
        </div>
        <button className={`text-white text-center block w-full p-2 rounded-sm ${canSend ? 'bg-blue-500' : 'bg-gray-400'} mb-2`} disabled={!canSend}>Register</button>
        <Link to='/login' className='text-blue-500'>Login</Link>
      </form>
    </div>
  )
}

export default Register;