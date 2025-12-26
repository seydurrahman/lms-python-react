import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import {useAuth} from "../context/AuthContext"

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const {user} = useAuth

  useEffect(() => {
    api.get(`lms/courses/${id}/`).then(res => setCourse(res.data));
  }, [id]);

  const enroll = async () => {
    try {
      await api.post(`lms/enroll/${id}/`);
      alert("Enrolled successfully");
    } catch {
      alert("Enrollment failed");
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
      <p className="mb-4">{course.description}</p>

      {user?.role==="student" &&(
        <button
        onClick={enroll}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Enroll
      </button>
      )}
    </div>
  );
}
