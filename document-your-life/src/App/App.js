/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-key */

import React, { useState } from "react";

// React Router Dom
import { Routes, Route } from "react-router-dom";

// Components
import HeaderNavbar from '../Components/HeaderNavbar/HeaderNavbar';
import TabDashboard from '../Components/TabDashboard/TabDashboard';
import FormSignIn from "../Components/FormSignIn/formSignIn";

import HomePage from "../Components/HomePage/HomePage";
import Login from "../Components/LoginForm/LoginForm";

// Sass
import './App.css';
import { Refreshtoken } from "../Login/LoginRequest";

function App() {
  const [isConnected, setIsConnected] = useState(true)
  return (
    <div className="App">
      <button onClick={() => {
        const data = localStorage.getItem("token")
        console.log('localsorage', data)
        Refreshtoken()
      }}>token test</button>
      <button onClick={() => {
        Refreshtoken()
      }}>token test2</button>
      <HeaderNavbar connectionStatus={isConnected}/>

      <Routes>
        <Route path="/" element={
          <HomePage />}
        />
        <Route path="/signup" element={
          <FormSignIn />}
        />
        <Route path="/login" element={
          <Login toggleConnection={setIsConnected}/>}
        />
        <Route path="/dashboard/*" element={
          <TabDashboard />
        }
        />

      </Routes>
    </div>
  );
}

export default React.memo(App);
