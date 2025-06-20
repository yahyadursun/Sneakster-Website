import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Sadece "/collection" sayfasında görünmesini sağlıyoruz
    setVisible(location.pathname === "/collection");
  }, [location]);

  // Function to clear the search input
  const clearSearch = () => {
    setSearch(""); // Clear the search input
  };

  return (
    showSearch && visible && (
      <div className="bg-transparent p-2">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 outline-none bg-transparent text-sm p-2"
            type="text"
            placeholder="Search..."
            style={{
              border: "none", // Remove default border
              transition: "border-color 0.3s ease", // Smooth transition on focus
            }}
            onFocus={(e) => {
              e.target.style.outline = "none"; // Remove outline on focus
              e.target.style.borderBottom = "1px solid #4a90e2"; // Underline effect on focus
            }}
            onBlur={(e) => {
              e.target.style.borderBottom = "none"; // Remove underline on blur
            }}
          />
          {/* Clear button/icon */}
          {search && (
            <img
              onClick={clearSearch}
              className="cursor-pointer w-4 h-4 ml-2"
              src={assets.cross_icon}
              alt="Clear"
              style={{
                transition: "opacity 0.3s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.6")} // Slight opacity change on hover
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")} // Reset opacity
            />
          )}
        </div>
      </div>
    )
  );
};

export default SearchBar;
