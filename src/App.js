import { Outlet, useNavigate } from "react-router-dom";
import Message from "./components/Message";
import logo from './assets/img/logo.PNG';
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [myUserId, setMyUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    axios.post('https://dchats.netlify.app/api/auth/verify', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        if (response.status === 201) {
          console.log(response.data);
          setMyUserId(response.data.userId);
          localStorage.setItem("userId", response.data.userId);
        } else {
          console.log(response);
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log(error);
        navigate('/login');
      });
  }, []); // ✅ Runs only once on mount

  return (
    <div className="bg-cyan-600 h-full md:h-screen w-screen flex flex-col fixed z-0 overflow-hidden">
      <div className="w-screen h-12 flex flex-row pl-10  items-center relative ">
        <img className="h-8 " src={logo} alt="logo" />
      </div>
      <div className="flex flex-row w-full h-full mb-2  relative overflow-hidden ">
        <div className="w-[15%] md:w-[5%] sm:w-[7%] h-full flex flex-col justify-start pt-10 relative items-center">
          <div onClick={() => navigate('/add-friend')} className="mb-4 text-white cursor-pointer text-center rounded-full hover:bg-cyan-500">
            <img className="h-10 w-10" src="https://cdn-icons-png.freepik.com/256/1705/1705968.png?semt=ais_hybrid" />
          </div>

          <div onClick={() => navigate('/chat')} className="mb-8 text-white cursor-pointer text-center rounded-full hover:bg-cyan-500">
            <img className="h-10 w-10" src="https://cdn-icons-png.flaticon.com/512/9374/9374926.png" />
          </div>

          <div className="flex-grow"></div>
          <div onClick={() => navigate('/profile')} className="mb-8 text-white cursor-pointer text-center justify-end rounded-full hover:bg-cyan-500 mt-auto">
            <img className="h-10 w-10" src="https://cdn-icons-png.freepik.com/256/1176/1176374.png?semt=ais_hybrid" />
          </div>
        </div>

        <div className="w-[85%] md:w-[95%] sm:w-[93%]  h-full mr-2 bg-white rounded-lg overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
