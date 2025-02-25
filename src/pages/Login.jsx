import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading,setloading]=useState(false)
    const User1=()=>{
        setEmail('pawan@gmail.com')
        setPassword('0000')
    }
    const User2=()=>{
        setEmail('devesh@gmail.com')
        setPassword('0000')
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form reload
        if (email !== "" && password !== "") {
            setloading(true)
            axios.post("https://dchats.netlify.app/api/auth/login", { email, password }

            ).then((response) => {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("userProfilePic",response.data.user.profilepic)
                        navigate("/");
                        setloading(false)
                    
                })
                .catch((error) => {
                    console.error(error.response?.data || error.message);
                    alert("Login Failed");
                    setloading(false)
                });
        }
    };

    return (
        loading ? <Loading /> : <div className="flex flex-col items-center justify-center h-screen">
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
                    <div className="flex flex-row justify-center">
                        <p className="text-gray-600">
                            Welcome! If you'd like to explore this project, you can auto-login as <strong>User 1</strong> or <strong>User 2</strong>.
                            Feel free to test the features and reach out for any questions!
                        </p>

                    </div>
                    <div className="flex flex-row w-full items-center justify-around space-y-1">
                        <button onClick={User1} className="bg-blue-500 h-12 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                            Test User 1
                        </button>
                        <button onClick={User2} type="submit" className="bg-blue-500 h-12 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                            Test User 2
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
