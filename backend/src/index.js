import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';
import swapsRoutes from './routes/swaps.js';

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://slot-swapper-ashen.vercel.app/"
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI missing in env');
  process.exit(1);
}

mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.get('/', (req, res) => res.json({ ok: true, name: 'SlotSwapper API' }));

app.use('/api/auth', authRoutes);
app.use('/api', eventsRoutes);
app.use('/api', swapsRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
