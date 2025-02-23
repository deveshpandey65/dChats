import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form reload
        if (email !== "" && password !== "") {
            axios.post("https://dchats.netlify.app/api/auth/login", { email, password }

            ).then((response) => {
                    console.log(response.data);
                    localStorage.setItem("token", response.data.token);
                        navigate("/");
                    
                })
                .catch((error) => {
                    console.error(error.response?.data || error.message);
                    alert("Login Failed");
                });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="bg-gray-300 p-8 rounded-lg shadow-md w-96 flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-4">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-3 w-full">
                    <div className="flex flex-col space-y-1 w-full">
                        <label className="text-sm text-gray-600" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="py-2 px-4 rounded-lg border border-gray-300"
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@example.com"
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm text-gray-600" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="py-2 px-4 rounded-lg border border-gray-300"
                            type="password"
                            id="password"
                            name="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-1">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                            Login
                        </button>
                    </div>
                    <div className="flex flex-row justify-center">
                        <p className="text-gray-600">Don't have an account?</p>
                        <button onClick={() => navigate("/register")} className="ml-2 text-blue-500 hover:text-blue-700">
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
