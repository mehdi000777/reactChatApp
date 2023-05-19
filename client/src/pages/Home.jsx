import React, { useEffect, useState } from 'react'
import Contacts from '../components/Contacts';
import Messages from '../components/Messages';
import { useGetUsersQuery } from '../app/slices/userApiSlice';
import { useSendLogoutMutation } from '../app/slices/authApiSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { RingLoader } from 'react-spinners';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../app/slices/authSlice';

const Home = () => {
  const [logout] = useSendLogoutMutation();
  const { data: users, isLoading } = useGetUsersQuery();

  const currentUser = useSelector(selectCurrentUser);

  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState('');
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    connectToWS();
  }, []);

  const connectToWS = () => {
    const ws = new WebSocket(`ws://${process.env.REACT_APP_SERVER_SOCET_URL}`);
    setWs(ws);
    ws.addEventListener('message', handleMessage);
    ws.addEventListener('close', () => connectToWS)
  }

  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    })
    setOnlinePeople(people);
  }

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    if ('online' in messageData) {
      showOnlinePeople(messageData?.online);
    } else if ('text' in messageData) {
      setMessages(prev => [...prev, { ...messageData }])
    }
  }

  const logoutHandler = async () => {
    const toastId = toast.loading('Please waite...');
    try {
      const { message } = await logout();
      setWs(null);
      setSelectedUserId(null);
      toast.update(toastId, { render: message, type: 'success', autoClose: true, isLoading: false });
      navigate('/login');
    } catch (error) {
      toast.update(toastId, { render: error?.data?.message, type: 'error', autoClose: true, isLoading: false });
    }
  }

  return (
    <div className='flex h-screen'>
      <div className='bg-white w-1/3 flex flex-col'>
        <div className='flex-grow overflow-y-scroll'>
          {
            isLoading ?
              <div className='flex w-full h-full justify-center items-center'>
                <RingLoader color='#60A5FA' />
              </div>
              : <Contacts onlinePeople={onlinePeople} setSelectedUserId={setSelectedUserId} selectedUserId={selectedUserId} users={users} />
          }
        </div>
        <div className='p-2 text-center flex items-center justify-center'>
          <span className='mr-2 text-gray-600 text-sm flex items-center gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
            Welcome {currentUser?.username}
          </span>
          <button className='text-sm text-gray-500 bg-blue-100 py-1 px-2 border rounded-sm' onClick={logoutHandler}>Logout</button>
        </div>
      </div>
      <div className='bg-blue-50 w-2/3 p-2 flex flex-col'>
        <Messages selectedUserId={selectedUserId} messages={messages} ws={ws} setMessages={setMessages} />
      </div>
    </div>
  )
}

export default Home;