import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD ENROLLED COURSES
  // =========================
  useEffect(() => {
    api
      .get("lms/my-enrollments/")
      .then((res) => setCourses(res.data))
      .catch(() => setError("Failed to load enrolled courses"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading enrolled courses...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>

      {error && <p className="text-red-600">{error}</p>}

      {courses.length === 0 ? (
        <p className="text-gray-500">
          You have not enrolled in any courses yet.
        </p>
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
                View Course →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
