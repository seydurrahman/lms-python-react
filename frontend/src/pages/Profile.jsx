import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

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

        if (res.data.profile_image) {
          setPreview(`http://127.0.0.1:8000${res.data.profile_image}`);
        }
      })
      .catch(() => {
        setError("Failed to load profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ===============================
  // HANDLE TEXT INPUT CHANGE
  // ===============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // HANDLE IMAGE CHANGE
  // ===============================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ===============================
  // UPDATE PROFILE (TEXT + IMAGE)
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();

    formData.append("email", form.email);
    formData.append("first_name", form.first_name);
    formData.append("last_name", form.last_name);

    if (image) {
      formData.append("profile_image", image);
    }

    try {
      const res = await api.put(
        "accounts/profile/update/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfile(res.data);
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
      <div className="bg-white p-4 rounded shadow mb-6 text-center">
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
          />
        ) : (
          <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <span className="text-gray-500">No Image</span>
          </div>
        )}

        <p><b>Username:</b> {profile.username}</p>
        <p><b>Role:</b> {profile.role}</p>
      </div>

      {/* UPDATE FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        {/* IMAGE UPLOAD */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        {/* EMAIL */}
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

        {/* FIRST NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            First Name
          </label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* LAST NAME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Last Name
          </label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
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
