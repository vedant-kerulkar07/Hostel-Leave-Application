import React, { useState } from "react";
import { SiGooglehome } from "react-icons/si";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { removeUser } from "@/redux/user/user.slice";

const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const response = await fetch(`${getEnv("VITE_API_URL")}/auth/logout`, {
        method: "get",
        credentials: "include", // important for cookie-based auth
      });

      const data = await response.json();

      if (!response.ok) {
        return showToast("error", data.message);
      }

      //  Save user in Redux
      dispatch(removeUser());
      navigate("/login");
      //  Show success message
      showToast("success", data.message);
    } catch (err) {
      showToast("error", err.message || "Server error");
    }
  }



  return (
    <header className="bg-white shadow border-b px-6 py-4 relative z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl sm:text-2xl font-bold text-teal-700 flex items-center gap-2">
          <SiGooglehome className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="hidden sm:inline">Hostel Leave Application</span>
          <span className="sm:hidden">Hostel Leave Application</span>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-teal-700 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium items-center">
          <Link to="/dashboard">
            <li className="hover:text-teal-600 cursor-pointer transition-colors">
              Dashboard
            </li>
          </Link>
          <Link to="/dashboard/applyleave">
            <li className="hover:text-teal-600 cursor-pointer transition-colors">
              Apply Leave
            </li>
          </Link>
          <Link to="/dashboard/timeline">
            <li className="hover:text-teal-600 cursor-pointer transition-colors">
              History
            </li>
          </Link>
          <Link to="/dashboard/notifications">
            <li className="hover:text-teal-600 cursor-pointer transition-colors">
              Notifications
            </li>
          </Link>
          <Link to="/dashboard/profile">
            <li className="hover:text-teal-600 cursor-pointer transition-colors">
              Profile
            </li>
          </Link>
          <div >
            <button onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors duration-200 px-4 py-2.5">
              Log out
            </button>
          </div>
        </ul>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <ul className="md:hidden mt-4 flex flex-col space-y-3 text-gray-700 font-medium bg-white border rounded-lg shadow-md p-4">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            <li className="hover:text-teal-600 transition">Dashboard</li>
          </Link>
          <Link to="/dashboard/applyleave" onClick={() => setMenuOpen(false)}>
            <li className="hover:text-teal-600 transition">Apply Leave</li>
          </Link>
          <Link to="/dashboard/timeline" onClick={() => setMenuOpen(false)}>
            <li className="hover:text-teal-600 transition">History</li>
          </Link>
          <Link to="/dashboard/notifications" onClick={() => setMenuOpen(false)}>
            <li className="hover:text-teal-600 transition">Notifications</li>
          </Link>
          <Link to="/dashboard/profile" onClick={() => setMenuOpen(false)}>
            <li className="hover:text-teal-600 transition">Profile</li>
          </Link>
          <div >
            <button onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors duration-200 px-4 py-2.5">
              Log out
            </button>
          </div>
        </ul>
      )}
    </header>
  );
};

export default Topbar;
