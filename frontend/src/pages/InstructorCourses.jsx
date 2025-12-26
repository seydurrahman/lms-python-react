import { useEffect, useState } from "react";
import api from "../api/axios";

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadCourses = () => {
    api.get("courses/").then(res => setCourses(res.data));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const createCourse = async () => {
    await api.post("courses/", { title, description });
    setTitle("");
    setDescription("");
    loadCourses();
  };

  const deleteCourse = async (id) => {
    await api.delete(`courses/${id}/`);
    loadCourses();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>

      {/* CREATE COURSE */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          className="border p-2 w-full mb-2"
          placeholder="Course title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <button
          onClick={createCourse}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Course
        </button>
      </div>

      {/* COURSE LIST */}
      {courses.map(course => (
        <div
          key={course.id}
          className="bg-white p-4 rounded shadow mb-3 flex justify-between"
        >
          <span>{course.title}</span>
          <button
            onClick={() => deleteCourse(course.id)}
            className="text-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
