import { useEffect, useState } from "react";
import api from "../api/axios";
import Loading from "../components/Loading";
import Error from "../components/Error";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("dashboard/enrollments/")
      .then(res => setStats(res.data))
      .catch(() => setError("Failed to load reports"));
  }, []);

  if (error) return <Error message={error} />;
  if (!stats.length) return <Loading />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Enrollment Report
      </h2>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Course</th>
            <th className="p-3">Enrollments</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(item => (
            <tr key={item.course_id} className="border-t">
              <td className="p-3">{item.course_title}</td>
              <td className="p-3">{item.total_enrollments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
