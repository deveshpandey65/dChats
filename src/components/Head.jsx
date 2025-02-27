import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

export default function Head() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showList, setShowList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupName, setGroupName] = useState("");
  const [showGroupNameInput, setShowGroupNameInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const userId = localStorage.getItem("userId"); // Get self user ID

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://dchats.netlify.app/api/message/create-group/searchMembers',
        { userId },
        { headers: { 'Authorization': localStorage.getItem("token") } }
      );
      const friendsList = response.data.friends.filter(friend => friend._id !== userId);
      setFriends(friendsList);
      setFilteredFriends(friendsList);
      setShowList(true);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
    setLoading(false);
  };

  const handleCheckboxChange = (friendId) => {
    setSelectedFriends(prevSelected =>
      prevSelected.includes(friendId)
        ? prevSelected.filter(id => id !== friendId)
        : [...prevSelected, friendId]
    );
  };

  const handleCreateGroup = () => {
    if (selectedFriends.length > 0) {
      setShowGroupNameInput(true);
      setShowList(false);
    }
  };

  const handleSubmit = async () => {
    if (!groupName.trim()) return;
    setLoading(true);

    const groupMembers = [userId, ...selectedFriends]; // Ensure self is included
    try {
      await axios.post(
        'https://dchats.netlify.app/api/message/create-group',
        { participantes: groupMembers, groupId: groupName },
        { headers: { 'Authorization': localStorage.getItem("token") } }
      );
      setShowList(false);
      setShowGroupNameInput(false);
      setSelectedFriends([]);
      setGroupName("");
      setSearchTerm("");
      navigate('/', { replace: true });
      alert('Group Created')
    } catch (error) {
      console.error("Error creating group:", error);
    }
    setLoading(false);
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    setFilteredFriends(
      friends.filter(friend =>
        friend.name.toLowerCase().includes(searchValue)
      )
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setShowList(false);
        setShowGroupNameInput(false);
        setSelectedFriends([]);
        setGroupName("");
      }
    };

    if (showList || showGroupNameInput) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showList, showGroupNameInput]);

  return (
    <div className='flex flex-col w-full'>
      <div className="flex flex-row items-center justify-between ml-2 mr-2 h-12">
        <h1 className="text-lg font-bold">Chats</h1>
        <h1 onClick={handleClick} className="text-lg font-semibold cursor-pointer">Create Group</h1>
      </div>

      {loading && <Loading />}

      {!loading && showList && !showGroupNameInput && (
        <div ref={listRef} className="z-10 absolute top-14 left-0 right-0 bg-white shadow-md rounded-lg p-4 max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-2">Select Members</h2>

          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md mb-2 outline-none focus:border-blue-400"
          />

          <ul className="max-h-40 overflow-y-auto border-b pb-2">
            {filteredFriends.length > 0 ? (
              filteredFriends.map(friend => (
                <li key={friend._id} className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    value={friend._id}
                    checked={selectedFriends.includes(friend._id)}
                    onChange={() => handleCheckboxChange(friend._id)}
                    className="cursor-pointer"
                  />
                  <p>{friend.name}</p>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No friends found.</p>
            )}
          </ul>

          <button
            onClick={handleCreateGroup}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-full"
            disabled={selectedFriends.length === 0}
          >
            Continue
          </button>
        </div>
      )}

      {!loading && showGroupNameInput && (
        <div ref={listRef} className="z-10 absolute top-20 left-0 right-0 bg-white shadow-md rounded-lg p-4 max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-2">Enter Group Name</h2>

          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-2 border rounded-md mb-2 outline-none focus:border-blue-400"
          />

          <button
            onClick={handleSubmit}
            className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full"
            disabled={!groupName.trim()}
          >
            Create Group
          </button>
        </div>
      )}
    </div>
  );
}
