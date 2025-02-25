import React from "react";

export default function UserInfoCard({ person }) {
    return (
        <div className="fixed top-[20%] self-center  w-80 bg-white shadow-lg rounded-lg p-4 z-50 border">
            {/* Close Button */}
            {/* <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
                onClick={onClose}
            >
                ✖
            </button> */}

            {/* Profile Image */}
            <div className="flex flex-col items-center ">
                <img
                    className="h-32 w-32 rounded-full border-2 border-gray-300 hover:transform hover:scale-125 transition-all" 
                    src={person.img}
                    alt="Profile"
                />
                <h1 className="mt-3 text-xl font-semibold font-sans">{person.name}</h1>
                <p className="text-gray-600 text-sm mt-1 font-serif mb-4">
                    ~ {person.about ? person.about : ""}
                </p>
                {person.email ? 
                <div className="flex flex-col self-start ml-4">
                    <label className=" opacity-50 font-mono">Email:</label>
                    <h2 className=" opacity-70 font-mono">{person.email}</h2>
                </div>: null}
                
            </div>

        
        </div>
    );
}
