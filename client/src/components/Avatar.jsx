import React from 'react'

const Avatar = ({ userId, username, online }) => {
    const colors = ['bg-red-200', 'bg-purple-200', 'bg-green-200', 'bg-blue-200', 'bg-yellow-200', 'bg-teal-200']

    const userIdBase10 = parseInt(userId, 16);
    const color = colors[userIdBase10 % colors.length];

    return (
        <div className={`w-8 h-8 relative ${color} rounded-full flex items-center justify-center`}>
            <span className='opacity-70'>{username[0]}</span>
            <div className={`absolute w-3 h-3 ${online ? 'bg-green-400' : 'bg-gray-400'} border border-white bottom-0 right-0 rounded-full`}></div>
        </div>
    )
}

export default Avatar;