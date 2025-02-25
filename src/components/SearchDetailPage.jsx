import React, { useRef, useState } from 'react'
import search from '../assets/img/search.png'

export default function SearchDetailPage({ messages, setMessages , search }) {
    
    const inputRef = useRef(null);
    const handleSearch=(e)=>{
        e.preventDefault();
        const searchValue = inputRef.current.value;
        const filteredPersons = messages.filter(message =>
            message.message.includes(searchValue)
        );
        setMessages(
            filteredPersons
        )
    }
    return (
        search?
            <div className='flex flex-col z-50 '>
                <div className="z-10 absolute top-12 w-[90%] left-[5%]  max-w-80">
                    <input
                        ref={inputRef}
                        className="h-10 w-full max-w-80  rounded-md border-b-cyan-500 border-b-4 outline-none mt-2 mb-2 pl-10 transition-all duration-300"
                        type="text"
                        placeholder={"Search within chat" }
                        onChange={(e) => handleSearch(e)}
                    />
                </div >

            </div>
        :<>
        </>
        
    );
}