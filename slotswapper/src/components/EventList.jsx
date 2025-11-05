import React from "react";

export default function EventList({ events, onMakeSwappable, onDelete }) {
  if (events.length === 0)
    return (
      <p className="text-center text-gray-500 mt-6">
        No events added yet. Create one above!
      </p>
    );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-md">
        <thead className="bg-blue-100 text-blue-700 uppercase text-sm">
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
              }`}
            >
              <td className="py-3 px-4">{e.title}</td>
              <td className="py-3 px-4">
                {new Date(e.startTime).toLocaleString()}
              </td>
              <td className="py-3 px-4">
                {new Date(e.endTime).toLocaleString()}
              </td>
              <td className="py-3 px-4 font-semibold text-gray-700">
                {e.status}
              </td>
              <td className="py-3 px-4 text-right space-x-2">
                {e.status === "BUSY" && (
                  <button
                    onClick={() => onMakeSwappable(e._id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition"
                  >
                    Make Swappable
                  </button>
                )}
                <button
                  onClick={() => onDelete(e._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
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
