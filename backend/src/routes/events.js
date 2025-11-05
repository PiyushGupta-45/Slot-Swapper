import express from 'express';
import Event, { EVENT_STATUS } from '../models/Event.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

// List my events
router.get('/events', async (req, res) => {
  const events = await Event.find({ userId: req.user.id }).sort({ startTime: 1 });
  res.json(events);
});

// Create event
router.post('/events', async (req, res) => {
  const { title, startTime, endTime, status } = req.body;
  if (!title || !startTime || !endTime) return res.status(400).json({ error: 'Missing fields' });
  const validStatus = status && Object.values(EVENT_STATUS).includes(status) ? status : EVENT_STATUS.BUSY;
  const event = await Event.create({ title, startTime, endTime, status: validStatus, userId: req.user.id });
  res.status(201).json(event);
});

// Update event
router.patch('/events/:id', async (req, res) => {
  const { id } = req.params;
  const updates = {};
  ['title', 'startTime', 'endTime', 'status'].forEach(k => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });
  const event = await Event.findOneAndUpdate({ _id: id, userId: req.user.id }, updates, { new: true });
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

// Delete event
router.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  const event = await Event.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json({ ok: true });
});

export default router;
