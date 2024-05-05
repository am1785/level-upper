import React from 'react'
import Root from './routes/root.tsx'
import Ongoing from './components/home/Ongoing.tsx'
import './index.css'
import { Routes, Route } from 'react-router'
import { BrowserRouter, Navigate } from "react-router-dom";

import Backlog from './components/home/Backlog.tsx'
import Mylevel from './components/home/Mylevel.tsx'
import TaskView from './components/backlog/TaskView.tsx'
import Profile from './components/home/Profile.tsx'
import Footer from './components/home/Footer.tsx'
import Register from './components/home/Register.tsx'
import Login from './components/home/Login.tsx'
import InvalidRoute from './components/home/InvalidRoute.tsx'

import { useAuthData } from './hooks/useAuthData.tsx';

const App:React.FC = () => {
    const { status:userDataStatus, data: userData, error:userDataError } = useAuthData();
    return (
        <BrowserRouter>
          <Root />
            <Routes>
                <Route path="*" element= {<InvalidRoute />} />
                <Route path="/" element = {userData && userData.user ? <Ongoing userData={userData.user} /> : <Navigate to='/login'/>} />
                <Route path="/backlog" element = {userData && userData.user ? <Backlog userData={userData.user} /> : <Navigate to='/login'/>} />
                <Route path="/mylevel" element = {userData && userData.user ? <Mylevel userData={userData.user} /> : <Navigate to='/login'/>} />
                <Route path='/profile' element = {userData && userData.user ? <Profile userData={userData.user} /> : <Navigate to='/login'/>} />
                <Route path='/register' element = {userData && userData.user ? <Navigate to='/' /> : <Register />} />
                <Route path='/login' element = {userData && userData.user ? <Navigate to='/' /> : <Login />} />
                <Route path="/view/:task_id" element = {<TaskView />} />
            </Routes>
            <Footer />
          </BrowserRouter>
    )
}

export default App