import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                setLoading(true);
                try {
                    const response = await axios.post(
                        "https://dchats.netlify.app/api/auth/verify",
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (response.status === 201) {
                        alert("Already logged in");
                        navigate("/");
                    }
                } catch (error) {
                    console.error("Token verification failed:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        verifyToken();
    }, []); // ✅ Runs only once on mount

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (name && email && password && phone) {
            try {
                const response = await axios.post(
                    "https://dchats.netlify.app/api/auth/register",
                    { name, email, password, phone }
                );
                console.log(response.data);
                alert("Registration Success");
                navigate("/login");
            } catch (error) {
                console.error("Registration Error:", error.response?.data || error.message);
                alert("Registration Failed");
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please fill all fields.");
            setLoading(false);
        }
    };

    return loading ? (
        <Loading />
    ) : (
        <div className="flex flex-col justify-center items-center h-screen w-screen">
            <div className="bg-gray-300 p-8 rounded-lg shadow-md w-96 flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-4">Registration</h1>
                <form onSubmit={handleSubmit} className="space-y-3 w-full">
                    <div className="flex flex-col space-y-1 w-full">
                        <label className="text-sm text-gray-600" htmlFor="name">Name</label>
                        <input
                            className="py-2 px-4 rounded-lg border border-gray-300"
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter Your Name"
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-1 w-full">
                        <label className="text-sm text-gray-600" htmlFor="email">Email</label>
                        <input
                            className="py-2 px-4 rounded-lg border border-gray-300"
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Your Email"
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-1 w-full">
                        <label className="text-sm text-gray-600" htmlFor="phone">Mobile</label>
                        <input
                            className="py-2 px-4 rounded-lg border border-gray-300"
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter Your Number"
                            pattern="\d{10}"
                            title="Please enter a valid 10-digit phone number"
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm text-gray-600" htmlFor="password">Password</label>
                        <input
                            className="py-2 px-4 rounded-lg border border-gray-300"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Your Password"
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-1">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                            Register
                        </button>
                    </div>
                    <div className="flex flex-row justify-center">
                        <p className="text-gray-600">Already have an account?</p>
                        <button onClick={() => navigate("/login")} className="ml-2 text-blue-500 hover:text-blue-700">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
