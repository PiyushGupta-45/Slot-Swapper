import React from "react";

export default function EventList({ events, onMakeSwappable, onDelete }) {
  if (events.length === 0)
    return (
      <p className="text-center text-gray-500 mt-6">
        No events added yet. Create one above!
      </p>
    );

  // ✅ Format date in dd/mm/yyyy, hh:mm AM/PM
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
      <table className="min-w-full bg-white">
        <thead className="bg-blue-100 text-blue-700 uppercase text-sm font-semibold">
          <tr>
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Start</th>
            <th className="py-3 px-4 text-left">End</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e, i) => (
            <tr
              key={e._id}
              className={`border-t text-sm ${
                i % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <td className="py-3 px-4 font-medium text-gray-800">
                {e.title}
              </td>
              <td className="py-3 px-4 text-gray-700">{formatDate(e.startTime)}</td>
              <td className="py-3 px-4 text-gray-700">{formatDate(e.endTime)}</td>
              <td
                className={`py-3 px-4 font-semibold ${
                  e.status === "SWAPPABLE"
                    ? "text-blue-600"
                    : e.status === "BUSY"
                    ? "text-gray-700"
                    : "text-yellow-600"
                }`}
              >
                {e.status}
              </td>
              <td className="py-3 px-4 text-right space-x-2 flex flex-wrap justify-end gap-2">
                {e.status === "BUSY" && (
                  <button
                    onClick={() => onMakeSwappable(e._id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg transition text-sm"
                  >
                    Make Swappable
                  </button>
                )}
                <button
                  onClick={() => onDelete(e._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
