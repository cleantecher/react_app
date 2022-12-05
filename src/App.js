// import React, {useState} from 'react';
// // import logo from './logo.svg';
// import './App.css';
// import Axios from "axios"

// import statements are not working

const React = require("react");
const Axios = require("axios")

function App() {
  const [usernameReg, setUsernameReg]=useState("");
  const [passwordReg, setPasswordReg]=useState("");

  const [username, setUsername]=useState("");
  const [password, setPassword]=useState("");

  const [loginStatus, setLoginStatus]=useState("");

  Axios.defaults.withCredentials=true;

  const register=()=>{
    Axios.post("/register", {
      username:usernameReg,
      password:passwordReg
    }).then((responce)=>{
      console.log(responce)
    })
  }

  const login =()=> {
    Axios.post("/login",{
      username:username,
      password:password,
    }).then((responce)=>{
      // where did message come from?
      if(!responce.data.message){
        setLoginStatus(responce.data[0].username);

      }
    })
  }

  return (
    <div className="App">
    <div className='registration'>
      <h1>Registration</h1>
      <label>Username</label>
      <input type="text" placeholder='username'></input>
      <label>Password</label>
      <input type="password" placeholder='password'></input>
      <button>Register</button>
    </div>

    <div className='login'>
      <h1>login</h1>
      <label>Username</label>
      <input type="text" placeholder='username'></input>
      <label>Password</label>
      <input type="password" placeholder='password'></input>
      <button>login</button>
    </div>
    </div>
  );
}

export default App;
