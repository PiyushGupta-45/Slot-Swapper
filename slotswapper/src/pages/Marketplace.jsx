import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Marketplace() {
  const [slots, setSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [otherSlots, myData] = await Promise.all([
        api("/api/swappable-slots"),
        api("/api/events"),
      ]);
      setSlots(otherSlots);
      setMySlots(myData.filter((e) => e.status === "SWAPPABLE"));
    } catch (e) {
      console.error(e);
      setMessage("Failed to load slots.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const requestSwap = async (theirSlotId, mySlotId) => {
    try {
      setLoading(true);
      await api("/api/swap-request", "POST", {
        theirSlotId,
        mySlotId,
      });
      setMessage("Swap request sent successfully!");
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Marketplace</h2>

      {message && (
        <div className="mb-4 text-center text-blue-700 font-medium">
          {message}
        </div>
      )}

      {slots.length === 0 ? (
        <p className="text-gray-600 text-center">
          No swappable slots available right now.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot) => (
            <div
              key={slot._id}
              className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition duration-200 p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {slot.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(slot.startTime).toLocaleString()} →{" "}
                  {new Date(slot.endTime).toLocaleString()}
                </p>
              </div>

              <div className="mt-4">
                <p className="font-medium text-gray-700 mb-2">
                  Pick one of your <span className="text-blue-600">SWAPPABLE</span> slots:
                </p>

                <div className="space-y-2">
                  {mySlots.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      You have no swappable slots.
                    </p>
                  ) : (
                    mySlots.map((mySlot) => (
                      <button
                        key={mySlot._id}
                        onClick={() =>
                          requestSwap(slot._id, mySlot._id)
                        }
                        disabled={loading}
                        className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 text-sm text-blue-700 transition duration-200"
                      >
                        <span className="font-semibold">
                          {mySlot.title}
                        </span>{" "}
                        ({new Date(mySlot.startTime).toLocaleString()})
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
