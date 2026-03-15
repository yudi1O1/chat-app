import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BiPowerOff } from 'react-icons/bi';

function Logout() {
    const navigate = useNavigate()
    const handleClick = async () => {
        localStorage.clear()
        navigate("login")
    }
    return (
        <button type="button" className="logout-button" onClick={()=>{handleClick()}}>
            <BiPowerOff/>
      </button>
    
  )
}

export default Logout
