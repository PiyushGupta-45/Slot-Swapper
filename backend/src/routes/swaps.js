import express from "express";
import { requireAuth } from "../middleware/auth.js";
import Event, { EVENT_STATUS } from "../models/Event.js";
import SwapRequest from "../models/SwapRequest.js";
import mongoose from "mongoose";

const router = express.Router();

router.use(requireAuth);

/**
 * GET /api/swappable-slots
 * Show all SWAPPABLE slots that belong to other users
 */
router.get("/swappable-slots", async (req, res) => {
  try {
    const slots = await Event.find({
      userId: { $ne: req.user.id },
      status: EVENT_STATUS.SWAPPABLE,
    }).sort({ startTime: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/swap-request
 * Create a swap request between two SWAPPABLE slots
 */
router.post("/swap-request", async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;
    if (!mySlotId || !theirSlotId)
      return res.status(400).json({ error: "Missing slot ids" });

    const mySlot = await Event.findOne({
      _id: mySlotId,
      userId: req.user.id,
    });
    const theirSlot = await Event.findOne({ _id: theirSlotId });

    if (!mySlot || !theirSlot)
      return res.status(404).json({ error: "Slot not found" });

    if (String(theirSlot.userId) === String(req.user.id))
      return res
        .status(400)
        .json({ error: "Cannot request swap with your own slot" });

    if (
      mySlot.status !== EVENT_STATUS.SWAPPABLE ||
      theirSlot.status !== EVENT_STATUS.SWAPPABLE
    ) {
      return res.status(400).json({ error: "Both slots must be SWAPPABLE" });
    }

    // Set both slots to SWAP_PENDING
    mySlot.status = EVENT_STATUS.SWAP_PENDING;
    theirSlot.status = EVENT_STATUS.SWAP_PENDING;
    await mySlot.save();
    await theirSlot.save();

    const request = await SwapRequest.create({
      mySlot: mySlot._id,
      theirSlot: theirSlot._id,
      requester: req.user.id,
      recipient: theirSlot.userId,
      status: "PENDING",
    });

    // (Optional) Could emit WebSocket notification here
    res.status(201).json(request);
  } catch (e) {
    console.error("Swap request error:", e);
    res.status(500).json({ error: "Failed to create swap request" });
  }
});

/**
 * POST /api/swap-response/:requestId
 * Accept or reject a swap request
 */
router.post("/swap-response/:requestId", async (req, res) => {
  const { requestId } = req.params;
  const { accept } = req.body;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const reqDoc = await SwapRequest.findById(requestId).session(session);
    if (!reqDoc) throw new Error("Request not found");
    if (String(reqDoc.recipient) !== String(req.user.id))
      throw new Error("Not authorized to respond to this request");
    if (reqDoc.status !== "PENDING")
      throw new Error("Request already resolved");

    const mySlot = await Event.findById(reqDoc.mySlot).session(session);
    const theirSlot = await Event.findById(reqDoc.theirSlot).session(session);
    if (!mySlot || !theirSlot) throw new Error("Slots not found");

    // 🟥 If REJECTED
    if (!accept) {
      reqDoc.status = "REJECTED";
      await reqDoc.save({ session });

      if (mySlot.status === EVENT_STATUS.SWAP_PENDING)
        mySlot.status = EVENT_STATUS.SWAPPABLE;
      if (theirSlot.status === EVENT_STATUS.SWAP_PENDING)
        theirSlot.status = EVENT_STATUS.SWAPPABLE;

      await mySlot.save({ session });
      await theirSlot.save({ session });

      await session.commitTransaction();
      return res.json({ status: "REJECTED" });
    }

    // ✅ If ACCEPTED — swap ownership of both slots
    const ownerA = mySlot.userId;
    const ownerB = theirSlot.userId;

    mySlot.userId = ownerB;
    theirSlot.userId = ownerA;

    mySlot.status = EVENT_STATUS.BUSY;
    theirSlot.status = EVENT_STATUS.BUSY;

    await mySlot.save({ session });
    await theirSlot.save({ session });

    reqDoc.status = "ACCEPTED";
    await reqDoc.save({ session });

    await session.commitTransaction();
    res.json({ status: "ACCEPTED" });
  } catch (e) {
    console.error("Swap response error:", e.message);
    // ✅ Only abort if transaction was actually started
    try {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
    } catch (innerErr) {
      console.warn("Abort skipped:", innerErr.message);
    }
    res.status(400).json({ error: e.message });
  } finally {
    await session.endSession();
  }
});

/**
 * GET /api/requests
 * Returns incoming and outgoing swap requests for current user
 */
router.get("/requests", async (req, res) => {
  try {
    const incoming = await SwapRequest.find({
      recipient: req.user.id,
    })
      .sort({ createdAt: -1 })
      .populate("mySlot")
      .populate("theirSlot");

    const outgoing = await SwapRequest.find({
      requester: req.user.id,
    })
      .sort({ createdAt: -1 })
      .populate("mySlot")
      .populate("theirSlot");

    res.json({ incoming, outgoing });
  } catch (e) {
    console.error("Fetch requests error:", e);
    res.status(500).json({ error: "Failed to load requests" });
  }
});

export default router;
