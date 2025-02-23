import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent page reload

        if (name && email && password && phone) {
            axios
                .post("https://dchats.netlify.app/api/auth/register", {
                    name,
                    email,
                    password,
                    phone,
                })
                .then((response) => {
                    console.log(response.data);
                    alert("Registration Success");
                    navigate("/login");
                })
                .catch((error) => {
                    console.log(error.response?.data || error.message);
                    alert("Registration Failed");
                });
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen">
            <div className="bg-gray-300 p-8 rounded-lg shadow-md w-96 flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-4">Registration</h1>
                <form onSubmit={handleSubmit} className="space-y-3 w-full">
                    <div className="flex flex-col space-y-1 w-full">
                        <label className="text-sm text-gray-600" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="py-2 px-4 rounded-lg border border-gray-300"
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            name="name"
                            placeholder="Enter Your Name"
                            required
                        />
                    </div>
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
                            placeholder="Enter Your Email"
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-1 w-full">
                        <label className="text-sm text-gray-600" htmlFor="phone">
                            Mobile
                        </label>
                        <input
                            className="py-2 px-4 rounded-lg border border-gray-300"
                            type="text"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter Your Number"
                            pattern="\d{10}"
                            title="Please enter a valid 10-digit phone number"
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
