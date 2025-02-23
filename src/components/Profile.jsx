import React, { useState, useEffect } from "react";

export default function Profile() {
    const [user, setUser] = useState({
        profilePic: "https://static-00.iconduck.com/assets.00/profile-default-icon-512x511-v4sw4m29.png", 
        name: "John Doe",
        email: "johndoe@example.com",
        about: "Hello! I am a software developer.",
    });

    const [newAbout, setNewAbout] = useState(user.about);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Fetch user data from API or local storage (for now using dummy data)
        const storedUser = JSON.parse(localStorage.getItem("userProfile"));
        if (storedUser) {
            setUser(storedUser);
            setNewAbout(storedUser.about);
        }
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedFile(imageUrl);
        }
    };

    const handleSaveProfilePic = () => {
        if (selectedFile) {
            setUser({ ...user, profilePic: selectedFile });
            localStorage.setItem(
                "userProfile",
                JSON.stringify({ ...user, profilePic: selectedFile })
            );
            setSelectedFile(null);
        }
    };

    const handleSaveAbout = () => {
        setUser({ ...user, about: newAbout });
        localStorage.setItem(
            "userProfile",
            JSON.stringify({ ...user, about: newAbout })
        );
        setIsEditing(false);
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Profile</h2>

            {/* Profile Picture */}
            <div className="flex flex-col items-center">
                <img
                    src={selectedFile || user.profilePic}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border border-gray-300 shadow-md"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-2 text-sm"
                />
                {selectedFile && (
                    <button
                        onClick={handleSaveProfilePic}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save Profile Picture
                    </button>
                )}
            </div>

            {/* User Details */}
            <div className="mt-6">
                <p>
                    <strong>Name:</strong> {user.name}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>About:</strong>
                </p>

                {/* Edit About Section */}
                {isEditing ? (
                    <div>
                        <textarea
                            value={newAbout}
                            onChange={(e) => setNewAbout(e.target.value)}
                            className="w-full p-2 border rounded mt-2"
                        />
                        <button
                            onClick={handleSaveAbout}
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Save
                        </button>
                    </div>
                ) : (
                    <p className="mt-2">{user.about}</p>
                )}
            </div>

            {/* Edit Button */}
            {!isEditing && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    Edit About
                </button>
            )}
        </div>
    );
}
