import React, { useState } from 'react'
import "../css/LogSign.css"
import { Link, useNavigate } from 'react-router-dom';


const Login = () => {
  const [userEmail,setUserEmail] = useState("");
  const [usePassword,setUserPassword] = useState("");
  const navigate = useNavigate();
 

  function handleSubmit(e){
    e.preventDefault();
    const formData = {
      email: userEmail,
      password: usePassword
    };
    fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if(data.success){
        alert('User logged in successfully')
        setUserEmail("");
        setUserPassword("");
        navigate('/')
        localStorage.setItem('token', data.token)
      }
      if(!data.success){
        alert('Invalid email or password')
      }
    })
  }

  return (
    <>
    <div className='loginPage'>
   <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="car" className="bgImage" />
   <div className='login-div'>
    <form onSubmit={handleSubmit}>
    <div className="login">
      <h1>Login</h1>
      <div className="container">
        <p>Email</p >
        <input type='email' value={userEmail} autoFocus onChange={(e)=> setUserEmail(e.target.value)} />
        <p>Password</p >
        <input type='password' value={usePassword} onChange={(e)=> setUserPassword(e.target.value)} />
        <button className='loginBtn' type="submit" onClick={(e)=>handleSubmit(e)}>Login</button>
        <p className='existing'>Don't have an account? <Link to="/signup" className='signup-link'>Signup</Link></p>
        <Link to="/forgot" className='resetPass'>Forgot password? </Link>
      </div>
    </div>
    </form>
   </div>
    </div>
    </>
  )
}

export default Login