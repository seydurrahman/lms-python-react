import { useEffect, useState } from "react";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import Loading from "../components/Loading";
import Error from "../components/Error";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("dashboard/summary/")
      .then(res => setData(res.data))
      .catch(() => setError("Failed to load dashboard data"));
  }, []);

  if (error) return <Error message={error} />;
  if (!data) return <Loading />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Users" value={data.total_users} />
        <StatCard title="Total Courses" value={data.total_courses} />
        <StatCard title="Total Enrollments" value={data.total_enrollments} />
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">
          Role-wise Users
        </h3>
        <ul className="space-y-2">
          <li>Admins: {data.role_wise_users.admin}</li>
          <li>Instructors: {data.role_wise_users.instructor}</li>
          <li>Students: {data.role_wise_users.student}</li>
        </ul>
      </div>
    </div>
  );
}
