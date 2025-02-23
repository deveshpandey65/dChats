import React, { useRef, useState } from 'react'
import search from '../assets/img/search.png'

export default function SearchInput() {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  return (
    <div className="relative w-full">
      <span
        className={`absolute inset-y-0 flex items-center transition-all duration-300  ${isFocused ? "left-2 text-gray-400" : "left-1/2 transform -translate-x-1/2 text-gray-500"
          }`}
        onClick={() => inputRef.current.focus()} 
      >
        <img className="w-5" src={search} alt="Search" />
      </span>

      <input
        ref={inputRef} 
        className="h-10 w-full border-2 border-gray-200 rounded-md focus:border-b-cyan-500 focus:border-b-4 focus:outline-none mt-2 mb-2 pl-10 transition-all duration-300"
        type="text"
        placeholder={isFocused ? "Search or start a new chat" : ""}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}