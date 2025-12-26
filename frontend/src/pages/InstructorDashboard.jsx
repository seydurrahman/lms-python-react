import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🚫 BLOCK NON-INSTRUCTORS
  useEffect(() => {
    if (user?.role !== "instructor") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // LOAD INSTRUCTOR COURSES
  useEffect(() => {
    api
      .get("lms/courses/")
      .then((res) => setCourses(res.data))
      .catch(() => setError("Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  // DELETE COURSE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      await api.delete(`lms/courses/${id}/`);
      setCourses(courses.filter((c) => c.id !== id));
    } catch {
      alert("Failed to delete course");
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Instructor Dashboard</h2>
      </div>

      <p className="text-gray-600">
        Manage your courses here.
      </p>

      {error && <p className="text-red-600">{error}</p>}

      {/* COURSE LIST */}
      {courses.length === 0 ? (
        <p className="text-gray-500">You have not created any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-5 rounded shadow"
            >
              <h3 className="font-semibold text-lg mb-2">
                {course.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                {course.description.slice(0, 80)}...
              </p>

              <div className="flex justify-between items-center text-sm">
                <Link
                  to={`/courses/${course.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>

                <div className="space-x-2">
                  <Link
                    to={`/courses/edit/${course.id}`}
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
