import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-bold">{course.title}</h3>
      <p className="text-gray-600 mb-2">
        {course.description.slice(0, 80)}...
      </p>

      <Link
        to={`/courses/${course.id}`}
        className="text-blue-600 hover:underline"
      >
        View Details
      </Link>
    </div>
  );
}