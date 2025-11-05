import React, { useState } from "react";

export default function EventForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [startTime, setStart] = useState("");
  const [endTime, setEnd] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title || !startTime || !endTime) return;
    onCreate({ title, startTime, endTime });
    setTitle("");
    setStart("");
    setEnd("");
  };

  return (
    <form
      onSubmit={submit}
      className="grid md:grid-cols-4 gap-4 items-end text-sm"
    >
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-1">Title</label>
        <input
          type="text"
          placeholder="Enter event title"
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-1">Start</label>
        <input
          type="datetime-local"
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          value={startTime}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-1">End</label>
        <input
          type="datetime-local"
          className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
          value={endTime}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Add Event
        </button>
      </div>
    </form>
  );
}
