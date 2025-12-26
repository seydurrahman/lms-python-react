import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";


export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🚫 BLOCK NON-INSTRUCTORS
  useEffect(() => {
    if (user?.role !== "instructor") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // LOAD COURSE
  useEffect(() => {
    api.get(`lms/courses/${id}/`)
      .then(res => {
        setForm({
          title: res.data.title,
          description: res.data.description,
          category: res.data.category || "",
        });
      })
      .catch(() => setError("Failed to load course"))
      .finally(() => setLoading(false));
  }, [id]);

  // LOAD CATEGORIES
  useEffect(() => {
    api.get("lms/categories/")
      .then(res => setCategories(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.put(`lms/courses/${id}/`, {
        title: form.title,
        description: form.description,
        category: form.category? Number(form.category):null,
      });

      alert("Course updated successfully");
      navigate("/instructor/dashboard");
    } catch {
      setError("Course update failed");
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Course</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        <input
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="w-full border p-2 rounded"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <select
          className="w-full border p-2 rounded"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Update Course
        </button>
      </form>
    </div>
  );
}
