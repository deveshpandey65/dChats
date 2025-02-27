import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

export default function AddFriend() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const myUserId = localStorage.getItem("userId");
  const searchTimeoutRef = useRef(null);
  const navigate=useNavigate()

  useEffect(() => {
    
    if (search.length > 2) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        fetchUsers();
      }, 300);
    } else {
      setUsers([]);
      setLoading(false);
      if (search.length>0){
        setLoading(true);
      }
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        
        `https://dchats.netlify.app/api/friend/users?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
    setLoading(false);
  };

  const handleAddFriend = async (friendId) => {
    try {
      setLoading(true)
      await axios.post(
        "https://dchats.netlify.app/api/friend/add-friend",
        { userId: myUserId, friendId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Friend added!");
      navigate('/chat')

      setLoading(false)
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Search Friend</h1>

      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
        {loading && (
          <div className="absolute right-3 top-3 text-blue-500 font-semibold">
            
          </div>
        )}
      </div>

      {loading && (
        <div className="mt-4 text-blue-500 font-semibold">Loading...</div>
      )}

      {!loading && search.length > 0 && users.length === 0 && (
        <div className="mt-4 text-gray-500">No Users Found</div>
      )}

      {users.length > 0 && !loading && (
        <div className="bg-white flex flex-col items-center p-4 rounded shadow-md mt-4">
          <h2 className="text-lg font-semibold mb-2">Search Results</h2>
          <ul>
            {users.map((user) => (
              <li
                key={user._id}
                className="flex flex-col justify-between items-center p-2 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedUser(user)}
              >
                <img
                  src={user.profilepic}
                  alt={user.username}
                  className="w-20 h-20 bg-slate-500 rounded-full"
                />
                <h1>Name: {user.name}</h1>
                <h1>Email: {user.email}</h1>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedUser && (
        loading ? <Loading /> : <div className="mt-4 p-4 bg-gray-100 rounded shadow-md">
          <h2 className="text-lg font-semibold">Selected User</h2>
          <p>Name: {selectedUser.name}</p>
          <p>Email: {selectedUser.email}</p>
          {selectedUser._id !== myUserId &&
            (!selectedUser.friends.includes(myUserId) && (
              <button
                onClick={() => handleAddFriend(selectedUser._id)}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Friend
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
