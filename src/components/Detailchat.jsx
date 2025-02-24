import React, { useEffect, useState, useRef } from "react";
import SearchDetailPage from "./SearchDetailPage";
import logo from "../assets/img/logo.PNG";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { Realtime } from "ably";
import Loading from "./Loading";

const ably = new Realtime("FbmcJA.AarP_A:4D7MBgZkSEhe1B6QQ6-Q9Zg4QkF23bAtwwdAx1vBV08");

export default function DetailChat({ person }) {
    const [messages, setMessages] = useState([]);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [loading,setLoading]=useState(false)

    const userId = localStorage.getItem("userId");

    const channelName = person?.type === "group"
        ? `group-${person._id}`
        : `chat-${[userId, person._id].sort().join("-")}`;

    const channel = ably.channels.get(channelName);

    const getMessages = async () => {
        if (!person?._id) return;

        const key = person.type === "group" ? "groupId" : "friendId";
        const requestData = { userId, [key]: person._id };
        setLoading(true)

        try {
            const response = await axios.post(
                "https://dchats.netlify.app/api/message/get-message",
                requestData,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            setMessages(response.data.messages || []);
            setLoading(false)
        } catch (error) {
            console.error("Error fetching messages:", error);
            setMessages([]);
            setLoading(false)
        }
    };

    const handleSend = async (event) => {
        event.preventDefault();
        if (!message.trim()) return;

        // Immediately clear the input field
        const tempMessage = message;
        setMessage('');

        const key = person.type === "group" ? "groupId" : "receiverId";

        try {
            const response = await axios.post(
                "https://dchats.netlify.app/api/message/send-message/",
                { message: tempMessage, senderId: userId, [key]: person._id },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            if (response.data.newMessage) {
                setMessages(prevMessages => [...prevMessages, response.data.newMessage]);

                channel.publish("new-message", {
                    senderId: userId,
                    message: response.data.newMessage.message,
                    createdAt: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        const onMessageReceived = (message) => {
            console.log("Received Message by Ably:", message.data);

            if (message.data.senderId !== userId) {
                setMessages(prevMessages => [...prevMessages, message.data]);
            }
        };

        channel.subscribe("new-message", onMessageReceived);

        return () => {
            channel.unsubscribe("new-message", onMessageReceived);
        };
    }, [userId, channel]);

    useEffect(() => {
        if (person) {
            setShow(true);
            getMessages();
        } else {
            setShow(false);
            setMessages([]);
        }
    }, [person]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            {show ? (
                <div className="h-full w-full flex flex-col relative">
                    <div className="w-full flex items-center justify-between bg-white h-14 border-b-2 border-gray-200 px-4">
                        <div className="flex items-center">
                            <div className="flex items-center rounded-full overflow-hidden">
                                <img className="h-12 w-12 rounded-full mr-4" src={person.img} alt="Profile" />
                            </div>
                            <h1 className="font-semibold text-xl">{person.name}</h1>
                        </div>
                        <div className="flex items-end justify-end w-1/2">
                            <SearchDetailPage />
                        </div>
                    </div>

                    {
                        loading ? <> <Loading/></> : <div className="bg-gray-200 h-full w-full overflow-y-scroll p-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex w-full mb-2 ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[70%] w-auto p-3 shadow-md break-words text-sm ${msg.senderId === userId ? "bg-cyan-500 text-white rounded-l-lg rounded-tr-xl" : "bg-white text-black rounded-r-lg rounded-tl-xl"}`}>
                                        {msg.message}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    }

                    <div className="absolute bottom-0 left-0 w-full h-20 bg-white flex items-center justify-end sm:px-4 border-t shadow-md">

                        <label className="text-gray-500 hover:text-gray-700 cursor-pointer sm:p-2">
                            <input type="file" className="hidden" />
                            <FaPaperclip size={22} />
                        </label>

                        <form onSubmit={handleSend} className="flex flex-row w-full">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 w-16 sm:w-auto h-12 p-3 border rounded-full outline-none bg-gray-100 mx-3"
                            />

                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
                                type="submit"
                            >
                                <FaPaperPlane size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex h-full justify-center items-center">
                    <div className="bg-white">
                        <img src={logo} alt="Logo" className="w-20 h-22 object-cover opacity-50" />
                    </div>
                </div>
            )}
        </>
    );
}
