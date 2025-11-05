import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import EventForm from "../components/EventForm.jsx";
import EventList from "../components/EventList.jsx";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await api("/api/events");
      setEvents(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (payload) => {
    try {
      await api("/api/events", "POST", payload);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const makeSwappable = async (id) => {
    try {
      await api(`/api/events/${id}`, "PATCH", { status: "SWAPPABLE" });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const del = async (id) => {
    try {
      await api(`/api/events/${id}`, "DELETE");
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">My Events</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <EventForm onCreate={create} />
      </div>
      <EventList
        events={events}
        onMakeSwappable={makeSwappable}
        onDelete={del}
      />
    </div>
  );
}
