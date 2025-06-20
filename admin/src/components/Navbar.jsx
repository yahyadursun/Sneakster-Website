import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      {/* Logo */}
      <div className="flex items-center">
        <img src={assets.logo1} alt="Logo"  className="w-80 h-30">
        </img>
        
        {/* Decorative Line */}
        <svg width="500" height="100">
          <line x1="40" y1="5" x2="350" y2="5" stroke="#A1B3C1" strokeWidth="2" />
          
          {/* Subtitle */}
          <text x="50" y="30" fontFamily="Arial, sans-serif" fontSize="25" fill="#666666">
            ADMIN PANEL
          </text>
        </svg>
      </div>

      {/* Logout Button */}
      <button onClick={() => setToken('')} className="bg-gray-600 text-white px-5">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
