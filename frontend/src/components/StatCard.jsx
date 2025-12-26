export default function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h4 className="text-gray-500">{title}</h4>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
