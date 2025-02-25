import React, { useEffect, useRef, useState } from 'react'
import Detailchat from './Detailchat'
import Head from "../components/Head";
import SearchInput from '../components/Search';
import axios from 'axios';
import Loading from './Loading';

export default function Message() {
    const [chatsperson,setchatsperson]=useState([])
    const [userCard, setUserCard] = useState(false);
    let [personD, setpersonD] = useState(false)
    const [loading,setloading]=useState(false)
    const originalChatPersons = useRef([]);
    const [search, setSearch] = useState(false)
    useEffect(
        () => {
            const getFriends = async () => {
                const userId = localStorage.getItem("userId")
                const token = localStorage.getItem("token")
                setloading(true)
                axios.post(
                    'https://dchats.netlify.app/api/friend/get-friend',
                    { userId: userId },
                    { headers: { Authorization: `Bearer ${token}` } })
                    .then(response => {
                        setchatsperson(response.data.friends)
                        originalChatPersons.current = response.data.friends;
                        console.log(response.data.friends)
                        setloading(false)
                    })
                    .catch(
                        error => {
                            console.log(error)
                        }
                    )}
                    getFriends()
        },[]
    )
    const detailShow=(person)=>{
             setpersonD(person)
    }
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();

        // Check if the message is from today
        if (timestamp==0){
            return ''
        }
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        } else {
            return date.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: '2-digit' });
        }
    };

  return (
    <div className='w-full h-full flex flex-row '> 
        <div
        onClick={()=>{setUserCard(false)
            setSearch(false)}
        }
         className="w-1/2 xl:w-1/3 sm:w-1/2 h-full flex flex-col border-r-2 border-gray-200  rounded-tl-xl p-2">
          <Head />
              <SearchInput setchatsperson={setchatsperson} originalChatPersons={originalChatPersons.current} />
              {loading ? <div><Loading/></div> : <div className="flex flex-col h-full overflow-y-scroll">
                  {
                      chatsperson.map((person, index) => (
                          <div
                              key={person.id}
                              onClick={() => detailShow(person)}
                              className="flex flex-row items-center w-full  h-16 p-2 border-b-2 border-gray-200 hover:bg-gray-200 ">
                              
                              <div className="flex min-w-12 min-h-12 max-h-12 max-w-12 mr-2 flex-row items-center">
                                  <img
                                      className="min-w-12 min-h-12 max-h-12 max-w-12 rounded-full"
                                      src={person.img}
                                      alt="profile"
                                  />
                              </div>

                                <div className="flex flex-col w-full overflow-hidden">
                                  <div className="flex items-center h-6 justify-between">
                                        <div className='flex h-6 max-w-[50%] justify-start truncate  overflow-hidden whitespace-nowrap  '>
                                          <h1 className="  font-semibold truncate  overflow-hidden whitespace-nowrap">
                                              {person.name}
                                          </h1>
                                        </div>
                                        <div className='flex justify-end w-16 h-6 mr-2 truncate  overflow-hidden whitespace-nowrap  '>
                                          <span className="text-gray-500 font-semibold text-sm ">
                                              {formatTime(person.lastMessageTime)}
                                          </span>
                                        </div>
                                  </div>

                                  <div className="flex items-center h-6 justify-between">
                                      <div className='flex h-6 max-w-[50%] justify-start truncate  overflow-hidden whitespace-nowrap  '>
                                          <h1 className=" text-zinc-700  truncate  overflow-hidden whitespace-nowrap">
                                              { person.lastMessage.message}
                                          </h1>
                                      </div>
                                      <div className='flex justify-start w-16 h-6 mr-2 truncate  overflow-hidden whitespace-nowrap  '>
                                          <span className="text-gray-500 font-semibold text-sm truncate  overflow-hidden whitespace-nowrap ">
                                              {person.lastSeen}
                                          </span>
                                      </div>
                                      {/* <span className="text-gray-400 truncate max-w-[50%] overflow-hidden whitespace-nowrap">{person.lastSeen}</span>
                                      <br></br>
                                      <span>{person.lastMessage.message}</span> */}
                                  </div>
                               </div>
                          </div>
                      ))
                  }

              </div>}
       </div>
        <div className="w-1/2 xl:w-2/3 sm:w-1/2 h-full flex flex-col overflow-hidden  bg-white" >
              <Detailchat person={personD} setSearch={setSearch} search={search} userCard={userCard} setUserCard={setUserCard} />
        </div>
    </div>
  )
}
