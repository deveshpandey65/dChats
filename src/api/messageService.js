import axios from "axios";

const API_BASE_URL = "https://dchats.netlify.app/api/message";

const getMessages = async (userId, person) => {
    if (!person?._id) return [];

    const key = person.type === "group" ? "groupId" : "friendId";
    const requestData = { userId, [key]: person._id };

    try {
        const response = await axios.post(`${API_BASE_URL}/get-message`, requestData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
            
        
        return response.data.messages || [];

    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
};

const sendMessage = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/send-message`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.newMessage || null;
    } catch (error) {
        console.error("Error sending message:", error);
        return null;
    }
};

export { getMessages, sendMessage };
