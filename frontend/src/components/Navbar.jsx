import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
  };
  const handleClick = (event) => {
    event.preventDefault(); // Varsayılan davranışları engelle (gerekliyse)
    navigate("/collection"); // İlk olarak "collection" sayfasına git
    setTimeout(() => {
      toggleSearch(); // Sonrasında `toggleSearch` fonksiyonunu çağır
    }, 0); // Hemen ardından çalışması için 0 ms gecikme eklenir
  };

  return (
    <div className="flex items-center justify-between py-5 px-4 font-medium ">
      {/* Logo */}
      <Link
        to="/"
        className="funnel-sans text-xl text-gray-900 hover:text-gray-700 transition-colors"
      >
        <img src={assets.logo} className="w-36" alt="logo" />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex gap-8 text-base funnel-sans text-gray-700">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `hover:text-gray-900 transition-all montserrat ${
              isActive ? "text-gray-900 montserrat-bold" : ""
            }`
          }
        >
          HOME
        </NavLink>
        <NavLink
          to="/collection"
          className={({ isActive }) =>
            `hover:text-gray-900 transition-all montserrat ${
              isActive ? "text-gray-900 montserrat-bold" : ""
            }`
          }
        >
          COLLECTION
        </NavLink>
        
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `hover:text-gray-900 transition-all montserrat ${
              isActive ? "text-gray-900 montserrat-bold" : ""
            }`
          }
        >
          CONTACT
        </NavLink>
      </ul>

      {/* Icons */}
      <div className="flex items-center gap-6">
        <img
          onClick={handleClick}
          
          src={assets.search_icon}
          className="w-6 cursor-pointer hover:scale-110 transition-transform"
          alt="Search"
        />
        <div className="group relative">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            className="w-6 cursor-pointer hover:scale-110 transition-transform"
            src={assets.profile_icon}
            alt=""
          />
          {token && (
            <div
              className="group-hover:block hidden absolute dropdown-menu right-0 pt-4"
              style={{ zIndex: 2 }}
            >
              <div className="flex flex-col montserrat gap-2 w-36 py-3 px-5 bg-gray-100 text-gray-500 rounded shadow-lg">
                <p
                  onClick={() => navigate("/profile")}
                  className="montserrat cursor-pointer hover:text-black"
                >
                  Profilim
                </p>
                <p
                  onClick={() => navigate("/orders")}
                  className="montserrat cursor-pointer hover:text-black"
                >
                  Siparişlerim
                </p>
                <p onClick={logout} className="montserrat cursor-pointer hover:text-black">
                  Çıkış
                </p>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-6 min-w-5" alt="Cart" />
          <p
            className="absolute right-[5px] bottom-[5px] w-4 h-4 flex items-center justify-center leading-none 
  bg-black text-white aspect-square rounded-full text-[10px] shadow-md z-10 transform translate-x-1/2 translate-y-1/2"
          >
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden hover:scale-110 transition-transform"
          alt="Menu"
        />
      </div>

      {/* Sidebar Menu for Small Screen */}
      <div
        className={`absolute top-0 right-0 bottom-0 bg-white transition-all z-50 shadow-lg ${
          visible ? "w-3/4" : "w-0"
        } overflow-hidden`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-1 p-4 cursor-pointer text-gray-700 hover:text-black"
          >
            <img className="h-4" src={assets.dropdown_icon} alt="Back" />
            <p>Geri Dön</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-4 pl-6 border-t text-gray-700 hover:text-black"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-4 pl-6 border-t text-gray-700 hover:text-black"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          
          <NavLink
            onClick={() => setVisible(false)}
            className="py-4 pl-6 border-t text-gray-700 hover:text-black"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
