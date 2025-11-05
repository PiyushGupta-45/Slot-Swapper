import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const data = await api("/api/requests");
      // Filter out incomplete/empty requests
      setIncoming(
        (data.incoming || []).filter(
          (req) => req.mySlot && req.theirSlot && req.status === "PENDING"
        )
      );
      setOutgoing(data.outgoing || []);
    } catch (e) {
      console.error(e);
      setMessage("Failed to load requests.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const respond = async (id, accept) => {
    try {
      await api(`/api/swap-response/${id}`, "POST", { accept });
      setMessage(accept ? "Swap accepted successfully!" : "Swap rejected.");
      loadData();
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Requests</h2>

      {message && (
        <div className="text-blue-700 font-medium text-center mb-4">
          {message}
        </div>
      )}

      {/* Incoming Requests */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">
          Incoming
        </h3>

        {incoming.length === 0 ? (
          <p className="text-gray-500 italic text-center">
            No incoming swap requests yet.
          </p>
        ) : (
          incoming.map((req) => (
            <div
              key={req._id}
              className="bg-white border border-gray-200 rounded-xl shadow-md p-5 mb-4"
            >
              <p className="text-gray-700">
                <strong className="font-semibold">They want your:</strong>{" "}
                {req.theirSlot?.title}
              </p>
              <p className="text-gray-700 mt-1">
                <strong className="font-semibold">They offer:</strong>{" "}
                {req.mySlot?.title}
              </p>

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => respond(req._id, true)}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-1.5 rounded-lg transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => respond(req._id, false)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1.5 rounded-lg transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Outgoing Requests */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">
          Outgoing
        </h3>

        {outgoing.length === 0 ? (
          <p className="text-gray-500 italic text-center">
            No outgoing swap requests.
          </p>
        ) : (
          outgoing.map((req) => (
            <div
              key={req._id}
              className="bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-5 mb-4"
            >
              <p className="text-gray-700">
                <strong className="font-semibold">You requested:</strong>{" "}
                {req.theirSlot?.title}
              </p>
              <p className="text-gray-700 mt-1">
                <strong className="font-semibold">You offered:</strong>{" "}
                {req.mySlot?.title}
              </p>

              <p
                className={`mt-3 font-semibold ${
                  req.status === "PENDING"
                    ? "text-yellow-600"
                    : req.status === "ACCEPTED"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Status: {req.status}
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
