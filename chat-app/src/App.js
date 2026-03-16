import React from 'react'
import { BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './pages/Register'
import Chat from './pages/Chat'
import Login from './pages/Login'
import SetAvatar from './pages/SetAvatar'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/' element={<Chat />} />
        <Route path='/setavatar' element={<SetAvatar/>} />
        
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
