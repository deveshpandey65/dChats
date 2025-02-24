import userEvent from "@testing-library/user-event";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";

export default function Profile() {
    const [user, setUser] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [newAbout, setNewAbout] = useState("");
    const [showEditOptions, setShowEditOptions] = useState(false);

    useEffect(() => {
        axios.get(`https://dchats.netlify.app/api/profile/get-profile?userId=${localStorage.getItem('userId')}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                setUser(response.data);
                setNewEmail(response.data.email);
                setNewAbout(response.data.about);
            })
            .catch(error => console.error("Error fetching profile:", error));
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            uploadFile(file);
        }
    };

    const uploadFile = async (file) => {
        try {
            const formData = new FormData();
            const userId = localStorage.getItem("userId")
            formData.append("profile", file);
            formData.append("userId", userId)

            await axios.post("https://dchats.netlify.app/api/profile/profile-img", formData, userId, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": localStorage.getItem("token"),
                },
            })
                .then(response => {
                    console.log(response.data)
                    setUser((prevUser) => ({ ...prevUser, profilepic: response.data.filePath }));
                    
                })
                .catch(error => console.error("Error uploading file:", error));



            // 🔥 Update the user state with new profile image
            // setUser((prevUser) => ({
            //     ...prevUser,
            //     profilepic: response.data.filePath, // Update with new profile pic URL
            // }));
        } catch (error) {
            console.error("Upload Failed:", error);
        }
    };


    const handleSaveEmail = () => {
        setUser({ ...user, email: newEmail });
        setIsEditingEmail(false);
    };

    const handleSaveAbout = () => {
        axios.post("https://dchats.netlify.app/api/profile/setabout",{ about: newAbout, userId: localStorage.getItem('userId') },
            {
                headers: { "Authorization": localStorage.getItem("token") },
            }
        )
            .then(response => {console.log(response.data)
                setIsEditingAbout(false);
                setUser((prevUser) => ({ ...prevUser, about: newAbout }));
            })
            .catch(error => console.error("Error updating about:", error));

        
    };

    return (
        <div className="w-fit mx-auto mt-10 p-6 bg-slate-300 shadow-md rounded-lg transition-all transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-4">Profile</h2>
            <div className="relative flex flex-col items-center">
                <div
                    className="relative w-32 h-32 rounded-full group"
                    onMouseEnter={() => setShowEditOptions(true)}
                    onMouseLeave={() => setShowEditOptions(false)}
                    onClick={() => document.getElementById("fileInput").click()}
                >
                    <img
                        src={user.profilepic}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border border-gray-300 shadow-md object-cover"
                    />
                    {showEditOptions && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full cursor-pointer">
                            <FiEdit className="text-white text-2xl" />
                        </div>
                    )}
                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <div className="mt-6 flex flex-col items-center">
                <h2 className="text-2xl mb-2 font-bold">{user.name}</h2>

                <div className="flex items-center space-x-2">
                    <strong>Email:</strong>
                    {isEditingEmail ? (
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            onBlur={handleSaveEmail}
                            autoFocus
                            className="border-2 border-gray-300 p-1 rounded"
                        />
                    ) : (
                        <span className="flex items-center">
                            {user.email}

                        </span>
                    )}
                </div>

                <div className="mt-2 flex items-center space-x-2">
                    <strong>About:</strong>
                    {isEditingAbout ? (
                        <input
                            type="text"
                            value={newAbout}
                            onChange={(e) => setNewAbout(e.target.value)}
                            onBlur={handleSaveAbout}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveAbout();  
                            }}
                            autoFocus
                            className="border-2 border-gray-300 p-1 rounded"
                        />
                    ) : (
                        <span className="flex items-center">
                            {user.about}
                            <FiEdit
                                className="ml-2 cursor-pointer text-gray-500 hover:text-gray-800"
                                onClick={() => setIsEditingAbout(true)}
                            />
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
