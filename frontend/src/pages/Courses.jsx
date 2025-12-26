import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Courses() {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD COURSES
  // =========================
  useEffect(() => {
    api
      .get("lms/courses/")
      .then((res) => setCourses(res.data))
      .catch(() => setError("Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading courses...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Courses</h2>

        {/* CREATE COURSE BUTTON */}
        {(user?.role === "admin" || user?.role === "instructor") && (
          <Link
            to="/courses/create"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Create Course
          </Link>
        )}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {/* COURSE LIST */}
      {courses.length === 0 ? (
        <p className="text-gray-500">No courses available.</p>
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
                {course.description.length > 100
                  ? course.description.slice(0, 100) + "..."
                  : course.description}
              </p>

              <Link
                to={`/courses/${course.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
