import React, { useState } from "react";
import { FaPaperclip, FaPaperPlane, FaTimes } from "react-icons/fa";
import { sendMessage } from "../api/messageService";
import { Realtime } from "ably";

const ably = new Realtime("FbmcJA.AarP_A:4D7MBgZkSEhe1B6QQ6-Q9Zg4QkF23bAtwwdAx1vBV08");

export default function ChatInput({ userId, person, setMessages, channel }) {
    const [message, setMessage] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleSend = async (event) => {
        event.preventDefault();
        if (!message.trim() && selectedFiles.length === 0) return;

        const formData = new FormData();
        formData.append("senderId", userId);
        formData.append(person.type === "group" ? "groupId" : "receiverId", person._id);
        if (message.trim()) formData.append("message", message);
        selectedFiles.forEach((file) => formData.append("files", file));

        const newMessage = await sendMessage(formData);
        if (newMessage) {
            setMessages((prev) => [newMessage, ...prev,]);

            channel.publish("new-message", {
                senderId: userId,
                message: newMessage.message,
                files: newMessage.files || [],
                createdAt: new Date().toISOString(),
            });
            
            person.lastMessage=newMessage.message
            person.lastMessageTime = Date()
            console.log(person)
            setSelectedFiles([]);
            setMessage("");
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 5 * 1024 * 1024; // 5MB limit
        const validFiles = files.filter(file => file.size <= maxSize);

        if (validFiles.length !== files.length) {
            alert("Some files exceed the 5MB limit and were not selected.");
        }
        setSelectedFiles(validFiles);
    };

    return (
        person?
        <div className="relative flex w-full h-20 bg-white items-center sm:px-4 border-t shadow-md">
            <label className="text-gray-500 hover:text-gray-700 cursor-pointer sm:p-2 mr-2">
                <input type="file" className="hidden" multiple onChange={handleFileChange} />
                <FaPaperclip size={22} />
            </label>
            <form onSubmit={handleSend} className="flex w-full items-center">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow h-12 p-2 mx-2 w-8 sm:w-auto border rounded-full outline-none bg-gray-100 text-sm"
                />
                <button className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition" type="submit">
                    <FaPaperPlane size={18} />
                </button>
            </form>
        </div>
        :<></>
    );
}
