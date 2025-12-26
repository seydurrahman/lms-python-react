import AdminDashboard from "./AdminDashboard";
import InstructorDashboard from "./InstructorDashboard";
import StudentDashboard from "./StudentDashboard";

const getUserRole = () => {
  const token = localStorage.getItem("access");
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.role;
};

export default function RoleDashboard() {
  const role = getUserRole();

  if (role === "admin") return <AdminDashboard />;
  if (role === "instructor") return <InstructorDashboard />;
  if (role === "student") return <StudentDashboard />;

  return <h2>Unauthorized</h2>;
}
