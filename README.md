# SlotSwapper

## 🧭 Overview
SlotSwapper is a web-based slot management and swapping platform that allows users to create, manage, and swap their available time slots with others in real-time.  
It is built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) with **Tailwind CSS** for modern styling.

### 🎨 Design Choices
- **React + Vite** for a fast, modular frontend with clean component-based design.
- **Tailwind CSS** for responsive and consistent UI styling.
- **MongoDB + Mongoose Transactions** for safe swap operations.
- **JWT Authentication** for secure login and signup flow.
- **Render + Vercel hosting compatibility** for easy deployment.

---

## ⚙️ Setup and Installation (Run Locally)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/slotswapper.git
cd slotswapper
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

#### Create `.env` file
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

#### Start the Backend
```bash
npm run dev
```

Your backend will run at: **http://localhost:4000**

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs by default at: **http://localhost:5173**

---

## 🧩 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| **POST** | `/api/auth/signup` | Register a new user |
| **POST** | `/api/auth/login` | Login user and get JWT token |
| **GET** | `/api/events` | Fetch all events of logged-in user |
| **POST** | `/api/events` | Create a new event |
| **PATCH** | `/api/events/:id` | Update event status (e.g. make swappable) |
| **DELETE** | `/api/events/:id` | Delete a specific event |
| **GET** | `/api/swappable-slots` | Get swappable slots from other users |
| **POST** | `/api/swap-request` | Request a swap between two slots |
| **POST** | `/api/swap-response/:requestId` | Accept or reject a swap request |
| **GET** | `/api/requests` | View incoming and outgoing swap requests |

A complete Postman Collection is also available in the `/postman` folder.

---

## 💡 Assumptions
- Users are required to log in before accessing the dashboard or making swap requests.
- Time slots cannot overlap for a single user.
- Only `SWAPPABLE` slots are visible in the marketplace.

---

## 🔐 Demo Login Credentials (for testing)
You can use these demo accounts to quickly test the app without creating new users:

- **User 1 (Admin 1)**  
  Email: `admin1@gmail.com`  
  Password: `admin1`

- **User 2 (Admin 2)**  
  Email: `admin2@gmail.com`  
  Password: `admin2`

> These accounts are included only for demo/testing purposes. If you deploy to a public server, **do not** use these credentials in production. You can create new accounts via the Signup page or change these users in the database.

---

## 🚧 Challenges Faced

### 1️⃣ Mongo Transaction Error
Initially, we faced this error:
```
MongoTransactionError: No transaction started
```
This occurred because `abortTransaction()` was being called even when no active session existed.  
✅ **Solution:** Added a check `if (session.inTransaction())` before aborting.

### 2️⃣ Frontend Blank Screen
A blank white page appeared due to missing entry reference in `index.html`.  
✅ **Solution:** Corrected to `<script type="module" src="/src/main.jsx"></script>`.

### 3️⃣ Event Swap Logic Validation
Events were not swapping due to incorrect enum string formatting.  
✅ **Solution:** Replaced string interpolation bugs like `" + EVENT_STATUS.BUSY + "` with proper constants.

### 4️⃣ Styling Enhancements
The original UI lacked modern design consistency.  
✅ **Solution:** Rebuilt the entire frontend UI using **Tailwind CSS** for a professional and responsive look.

---

## 📦 Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express.js + MongoDB (Mongoose)
- **Auth:** JWT
- **Hosting (Optional):** Render (backend) + Vercel (frontend)

---

## 🧠 How to Test
1. Sign in using the demo credentials above or create two different users via Signup.
2. User A creates a slot and marks it as **SWAPPABLE**.
3. User B sees User A’s slot in the **Marketplace** and requests a swap.
4. User A accepts the request in **Requests** tab.
5. Observe both users’ slots are swapped automatically.

---

## 👨‍💻 Author
**Piyush Gupta**  
_Developed as part of the ServiceHive SDE Assignment._

---

## 🏁 Conclusion
SlotSwapper provides a reliable, user-friendly, and modern interface for managing and exchanging time slots seamlessly.
