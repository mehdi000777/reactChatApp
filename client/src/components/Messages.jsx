import React, { useEffect, useRef, useState } from 'react'
import { uniqBy } from 'lodash';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../app/slices/authSlice';
import SendMessageForm from './SendMessageForm';
import { useGetMessagesMutation } from '../app/slices/messageApiSlice';
import { toast } from 'react-toastify';

const Messages = ({ selectedUserId, messages, setMessages, ws }) => {
  const [getMessages] = useGetMessagesMutation();

  let showMessages = uniqBy(messages, 'id');

  const messageRef = useRef();

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const toastId = toast.loading('please waite...')
        const { entities } = await getMessages({ userId: selectedUserId }).unwrap();
        setMessages(Object.values(entities));
        toast.update(toastId, { isLoading: false, autoClose: 100, type: 'success' });
      } catch (error) {
        toast.error(error?.data?.message)
      }
    }

    if (selectedUserId) fetchMessages();

  }, [selectedUserId])

  const currentUser = useSelector(selectCurrentUser);

  return (
    <>
      <div className='flex-grow overflow-y-scroll'>
        {
          !selectedUserId && (
            <div className='w-full h-full flex justify-center items-center'>
              <span className='text-gray-300'>&larr; Selecte a person from the sidebar</span>
            </div>
          )
        }
        {
          !!selectedUserId &&
          <div>
            {
              showMessages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === currentUser?._id ? 'justify-end' : 'justify-start'}`}>
                  <div ref={messageRef} className={`${message.sender === currentUser?._id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'} p-2 my-2 rounded-md text-sm text-left`}>
                    {message.text}
                    {message?.file && (
                      <div className='flex items-center gap-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                        </svg>
                        <a target='_blank' className='underline' href={`${process.env.REACT_APP_SERVER_URL}/uploads/${message?.file}`}>
                          {message?.file}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        }
      </div>
      {
        !!selectedUserId &&
        <SendMessageForm ws={ws} selectedUserId={selectedUserId} setMessages={setMessages} />
      }
    </>
  )
}

export default Messages;