import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "../assets/lma-icon.png";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    logout(); // clear token + user
    navigate("/login"); // redirect to login
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between">
      <div className="flex items-center gap-2">
        <img
          src={Icon}
          alt="LMS Logo"
          style={{ width: "32px", height: "32px" }}
        />
        <h1 className="text-2xl font-bold">LMS</h1>
      </div>

      <div className="space-x-8">
        <Link to="/dashboard">Dashboard</Link>
        
        <Link to="/courses">Courses</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/change-password">Change Password</Link>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </nav>
  );
}
