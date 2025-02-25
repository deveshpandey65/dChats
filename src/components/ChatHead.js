import React, { useState } from 'react';
import SearchDetailPage from './SearchDetailPage';
import UserInfoCard from './UserInfoCard';
import searchlogo from '../assets/img/search.png'
export default function ChatHead({ person, messages, setMessages, userCard, setUserCard ,setSearch, search }) {


  const handleClick = () => {
    setUserCard(userCard?false:true);
    setSearch(false);
  };

  return (
    person ? (
      <div className="  w-full flex items-center justify-between bg-white h-16 border-b-2 border-gray-200 px-4">
        {userCard && <UserInfoCard person={person} />}
        <div className="z-20 flex items-center cursor-pointer" onClick={handleClick}>
          <img className="h-12 w-12 rounded-full mr-4" src={person.img} alt="Profile" />
          <h1 className="font-semibold text-xl">{person.name}</h1>

        </div>
        <div className='flex justify-end'>
          <img className="w-5" onClick={() => setSearch(search ? false : true)}
            src={searchlogo} alt="" />
        </div>

        
        <SearchDetailPage messages={messages} setMessages={setMessages} setSearch={setSearch} search={search} />
      </div>
    ) : null
  );
}
