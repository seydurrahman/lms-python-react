import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("accounts/users/").then(res => setUsers(res.data));
  }, []);

  const updateRole = async (id, role) => {
    await api.put(`accounts/users/${id}/`, { role });
    alert("Role updated");
  };

  return (
    <div>
      <h2>Admin User Management</h2>

      {users.map(user => (
        <div key={user.id}>
          {user.username} — {user.role}

          <select
            onChange={(e) => updateRole(user.id, e.target.value)}
          >
            <option value="">Change Role</option>
            <option value="admin">Admin</option>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
          </select>
        </div>
      ))}
    </div>
  );
}
