import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import Register from './pages/Register';
import Login from './pages/Login';
import reportWebVitals from './reportWebVitals';
import AddFriend from './components/AddFriend';
import Message from './components/Message';
import Profile from './components/Profile';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router basename="/dchats">  {/* Added basename */}
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="chat" replace />} />
          <Route path="chat" element={<Message />} />
          <Route path="add-friend" element={<AddFriend />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
);

reportWebVitals();
