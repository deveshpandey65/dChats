import React, { useEffect, useRef } from "react";
import Loading from "./Loading";
import { Realtime } from "ably";
import logo from "../assets/img/logo.PNG";

const ably = new Realtime("FbmcJA.AarP_A:4D7MBgZkSEhe1B6QQ6-Q9Zg4QkF23bAtwwdAx1vBV08");

export default function ChatMessages({ setSearch , setUserCard, person, userId, messages, setMessages, channel, loading }) {
    const messagesEndRef = useRef(null);
    const [selectedImage, setSelectedImage] = React.useState("");
    let lastDate = null;

    useEffect(() => {
        const onMessageReceived = (msg) => {
            if (msg.data.senderId !== userId) {
                setMessages(prevMessages => [
                    {
                        ...msg.data,
                        timestamp: msg.data.createdAt
                    }, ...prevMessages
                ]);
            }
        };

        channel.subscribe("new-message", onMessageReceived);

        return () => {
            channel.unsubscribe("new-message", onMessageReceived);
        };
    }, [userId, channel]);

    const lastUserMessageIndex = messages
        .map((msg, index) => ({ ...msg, index }))
        .filter(msg => msg.senderId === userId && msg.read === true)
        .shift()?.index;

    return (
        person ?
            <div
                onClick={() => {
                    setUserCard(false);
                    setSearch(false);
                }}
                className="bg-gray-200 h-full w-full flex flex-col-reverse overflow-y-scroll p-4">
                {loading ? <Loading /> :
                    messages.length > 0 ? messages.map((msg, index) => {
                        
                        const msgDate = new Date(msg.timestamp).toLocaleDateString();
                        lastDate = lastDate ? lastDate : msgDate;
                        const showDateSeparator = msgDate !== lastDate;
                        const date = lastDate;
                        lastDate = msgDate;

                        return (
                            <React.Fragment key={index}>
                                {showDateSeparator && index !== messages.length - 1 && (
                                    <div className="flex justify-center py-2 my-2 w-full">
                                        <span className="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded-md shadow-md">
                                            {date}
                                        </span>
                                    </div>
                                )}
                                <div className={`flex w-full mb-2 ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                                    <div className={`relative max-w-[70%] min-w-24 px-3 pt-3 pb-5 shadow-md break-words text-sm ${msg.senderId === userId ? "bg-cyan-500 text-white rounded-l-lg rounded-tr-xl" : "bg-white text-black rounded-r-lg rounded-tl-xl"}`}>
                                        {msg.message}
                                        {msg.files && msg.files.length > 0 && (
                                            <div className="mt-2">
                                                {msg.files.map((file, idx) => (
                                                    <div key={idx} className="flex flex-col">
                                                        {file.type.startsWith("image/") ? (
                                                            <img
                                                                src={file.url}
                                                                alt="Sent file"
                                                                className="w-64 h-64 rounded-md cursor-pointer"
                                                                onClick={() => setSelectedImage(file.url)}
                                                            />
                                                        ) : (
                                                            <a
                                                                href={file.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg shadow-sm bg-gray-200 hover:bg-gray-300 transition-all overflow-hidden"
                                                                title={file.url.split("/").pop()}
                                                            >
                                                                📄
                                                                <span className="text-blue-600 font-medium hover:underline">
                                                                    {file.url.split("/").pop().length > 10
                                                                        ? file.url.split("/").pop().substring(0, 10) + "..."
                                                                        : file.url.split("/").pop()}
                                                                </span>
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="absolute bottom-1 right-2 flex items-center space-x-1 text-xs text-gray-300">
                                            <span>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </span>
                                            {msg.senderId === userId && index === lastUserMessageIndex && msg.read && (
                                                <span className="text-blue-500">✔</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {selectedImage && (
                                    <div
                                        className="fixed top-0 left-0 w-full h-full bg-[rgba(58,58,57,0.43)] flex justify-center items-center z-50"
                                        onClick={() => setSelectedImage(null)}
                                    >
                                        <img
                                            src={selectedImage}
                                            alt="Enlarged preview"
                                            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                )}
                                {index === messages.length - 1 && (
                                    <div className="flex justify-center py-2 my-2 w-full">
                                        <span className="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded-md shadow-md">
                                            {date}
                                        </span>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    }) :
                        <div className="flex flex-col items-center justify-center h-screen">
                            <h1 className="text-3xl font-bold text-gray-600">No messages yet</h1>
                            <p>Start a conversation by sending a message!</p>
                        </div>
                }
                <div ref={messagesEndRef} />
            </div>
            : <div className="flex flex-col justify-center items-center h-screen">
                <img className="h-20 bg-transparent opacity-55" src={logo} alt="Logo" />
                <h1 className="text-3xl font-bold text-gray-600 mt-4">dChats</h1>
            </div>
    );
}
