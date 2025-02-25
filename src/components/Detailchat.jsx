import React, { useEffect, useRef, useState } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { getMessages } from "../api/messageService";
import { Realtime } from "ably";
import SearchDetailPage from "./SearchDetailPage";
import ChatHead from "./ChatHead";

const ably = new Realtime("FbmcJA.AarP_A:4D7MBgZkSEhe1B6QQ6-Q9Zg4QkF23bAtwwdAx1vBV08");

export default function DetailChat({ person, userCard, setUserCard ,setSearch,search}) {
    
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem("userId");
    const originalChatMessages=useRef([])

    const channelName = person?.type === "group"
        ? `group-${person._id}`
        : `chat-${[userId, person._id].sort().join("-")}`;

    const channel = ably.channels.get(channelName);

    useEffect(() => {
        if (person) {
            setLoading(true);
            getMessages(userId, person).then((msgs) => {
                originalChatMessages.current = msgs;
                setMessages(msgs);
                setLoading(false);
            });
        } else {
            setMessages([]);
        }
    }, [person, userId]);

    return (
        <div className="h-full w-full flex flex-col relative">
            <ChatHead person={person} messages={originalChatMessages.current} setMessages={setMessages} userCard={userCard} setUserCard={setUserCard} setSearch={setSearch} search={search} />
            <ChatMessages setUserCard={setUserCard} t userId={userId} messages={messages} setMessages={setMessages} channel={channel} person={person} loading={loading} setSearch={setSearch} />
            <ChatInput setUserCard={setUserCard} userId={userId} person={person} setMessages={setMessages} channel={channel} setSearch={setSearch} />
        </div>
    );
}
