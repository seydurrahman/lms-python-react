export default function Error({ message }) {
  return (
    <div className="text-center py-10 text-red-600">
      {message || "Something went wrong"}
    </div>
  );
}