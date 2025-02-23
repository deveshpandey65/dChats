import React, { useEffect, useState } from 'react'
import Detailchat from './Detailchat'
import Head from "../components/Head";
import SearchInput from '../components/Search';
import axios from 'axios';

export default function Message() {
    const [chatsperson,setchatsperson]=useState([])
    let [personD, setpersonD] = useState(false)
    // get Friends
    useEffect(
        () => {
            const getFriends = async () => {
                const userId = localStorage.getItem("userId")
                const token = localStorage.getItem("token")
                axios.post(
                    'https://dchats.netlify.app/api/friend/get-friend',
                    { userId: userId },
                    { headers: { Authorization: `Bearer ${token}` } })
                    .then(response => {
                        setchatsperson(response.data.friends)
                        console.log(response.data.friends)
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
  return (
    <div className='w-full h-full flex flex-row '> 
        <div className="w-1/2 xl:w-1/3 sm:w-1/2 h-full flex flex-col border-r-2 border-gray-200  rounded-tl-xl p-2">
          <Head />
          <SearchInput />
          <div className="flex flex-col h-full overflow-y-scroll">
              {
                  chatsperson.map((person, index) => (
                      <div
                          key={person.id}
                          onClick={() => detailShow(person)}
                          className="flex flex-row items-center justify-between h-16 p-2 border-b-2 border-gray-200 hover:bg-gray-200 ">
                          <div className="flex flex-row items-center">
                              <img
                                  className="w-12 h-12 rounded-full"
                                  src={person.img}
                                  alt="profile"
                              />
                              <h1 className="ml-2 mr-8">{person.name}</h1>
                          </div>
                          <h1 className="text-gray-400">{person.lastSeen}</h1>

                      </div>
                  ))
              }

          </div>
       </div>
        <div className="w-1/2 xl:w-2/3 sm:w-1/2 h-full flex flex-col overflow-hidden  bg-white" >
            <Detailchat person={personD} />
        </div>
    </div>
  )
}
