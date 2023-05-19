import React, { useState } from 'react'
import { selectCurrentUser } from '../app/slices/authSlice';
import { useSelector } from 'react-redux';
import { useGetMessagesMutation } from '../app/slices/messageApiSlice';

const SendMessageForm = ({ ws, selectedUserId, setMessages }) => {
  const [messageText, setMessageText] = useState('');

  const [getMessages] = useGetMessagesMutation();

  const currentUser = useSelector(selectCurrentUser);

  const submitHandler = async (e, file = null) => {
    if (e) e.preventDefault();
    ws.send(JSON.stringify({
      recipient: selectedUserId,
      text: messageText,
      file
    }))
    setMessages(prev => [...prev, {
      text: messageText,
      sender: currentUser?._id,
      recipient: selectedUserId,
      id: Date.now()
    }]);
    setMessageText('');
    if (file) {
      const { entities } = await getMessages({ userId: selectedUserId }).unwrap();
      setMessages(Object.values(entities));
    }
  }

  const fileHandler = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      submitHandler(null, {
        name: e.target.files[0].name,
        data: reader.result
      })
    }
  }

  return (
    <form onSubmit={submitHandler} className='flex gap-2'>
      <input type="text" placeholder='Enter your message' className='bg-white p-2 border flex-grow rounded-sm' onChange={(e) => setMessageText(e.target.value)} value={messageText} />
      <label className='bg-gray-200 p-2 text-gray-500 rounded-sm border border-gray-300 cursor-pointer'>
        <input type="file" className='hidden' onChange={fileHandler} />
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
        </svg>
      </label>
      <button className='bg-blue-500 text-white p-2 rounded-sm'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </form>
  )
}

export default SendMessageForm;