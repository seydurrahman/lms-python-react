import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // LOAD PROFILE DATA
  // ===============================
  useEffect(() => {
    api
      .get("accounts/profile/")
      .then((res) => {
        setProfile(res.data);
        setForm({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          email: res.data.email || "",
        });
      })
      .catch(() => {
        setError("Failed to load profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ===============================
  // HANDLE FORM CHANGE
  // ===============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // UPDATE PROFILE
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.put("accounts/profile/update/", form);
      alert("Profile updated successfully");
    } catch {
      setError("Failed to update profile");
    }
  };

  // ===============================
  // UI STATES
  // ===============================
  if (loading) {
    return <p className="p-6 text-gray-500">Loading profile...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      {/* PROFILE INFO */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <p><b>Username:</b> {profile.username}</p>
        <p><b>Role:</b> {profile.role}</p>
      </div>

      {/* UPDATE FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            type="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            First Name
          </label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="First Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Last Name
          </label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Last Name"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
}
