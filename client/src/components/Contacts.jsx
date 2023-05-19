import React from 'react'
import Avatar from './Avatar';
import Logo from './Logo';
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../app/slices/authSlice';
import { RingLoader } from 'react-spinners'

const Contacts = ({ onlinePeople, setSelectedUserId, selectedUserId, users }) => {
  const currentUser = useSelector(selectCurrentUser);

  const offlineUsers = users?.ids.filter(id => !Object.keys(onlinePeople).includes(id));

  return (
    <>
      <Logo />
      {
        Object.keys(onlinePeople).map(userId => (
          userId !== currentUser?._id &&
          <div key={userId} onClick={() => setSelectedUserId(userId)} className={`border-b border-gray-100 flex items-center gap-2 cursor-pointer ${userId === selectedUserId ? 'bg-blue-50' : ''}`}>
            {
              userId === selectedUserId && (
                <div className='w-1 bg-blue-500 h-12 rounded-r-md'></div>
              )
            }
            <div className='flex items-center gap-2 pl-4 py-2'>
              <Avatar online={true} userId={userId} username={onlinePeople[userId]} />
              <span className='text-gray-800'>{onlinePeople[userId]}</span>
            </div>
          </div>
        ))
      }
      {
        offlineUsers.map(userId => (
          <div key={userId} onClick={() => setSelectedUserId(userId)} className={`border-b border-gray-100 flex items-center gap-2 cursor-pointer ${userId === selectedUserId ? 'bg-blue-50' : ''}`}>
            {
              userId === selectedUserId && (
                <div className='w-1 bg-blue-500 h-12 rounded-r-md'></div>
              )
            }
            <div className='flex items-center gap-2 pl-4 py-2'>
              <Avatar online={false} userId={userId} username={users?.entities[userId].username} />
              <span className='text-gray-800'>{users?.entities[userId].username}</span>
            </div>
          </div>
        ))
      }
    </>
  )
}

export default Contacts;