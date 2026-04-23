// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import authRoutes from "./routes/authRoutes.js";
// import donorRoutes from "./routes/donorRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import facilityRoutes from "./routes/facilityRoutes.js";
// import { swaggerUi, swaggerDocs } from "./openapi/index.js"

// dotenv.config();
// const app = express();

// app.use(express.json());

// app.use(cors({
//   origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both ports
//   credentials: true,
// }));

// app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// // 🧩 Routes

// app.use("/api/auth", authRoutes);


// app.use("/api/donor", donorRoutes);

// app.use("/api/facility", facilityRoutes);

// app.use("/api/admin", adminRoutes);



// import bloodLabRoutes from "./routes/bloodLabRoutes.js";
// app.use("/api/blood-lab", bloodLabRoutes);


// import hospitalRoutes from "./routes/hospitalRoutes.js";
// app.use("/api/hospital", hospitalRoutes);


// // 🗄️ DB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected ✅"))
//   .catch((err) => console.log("MongoDB Error ❌", err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
  
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import facilityRoutes from "./routes/facilityRoutes.js";
import bloodLabRoutes from "./routes/bloodLabRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";

// Swagger
import { swaggerUi, swaggerDocs } from "./openapi/index.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ CORS (SECURE + PRODUCTION READY)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://blood-bank-management-system-sage.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ Swagger docs
app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 🧩 Routes
app.use("/api/auth", authRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/facility", facilityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blood-lab", bloodLabRoutes);
app.use("/api/hospital", hospitalRoutes);

// ❌ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ❌ Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

// 🗄️ DB Connection + Server Start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000, // fix buffering timeout
  })
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT} 🚀`)
    );
  })
  .catch((err) => {
    console.error("MongoDB Error ❌", err.message);
    process.exit(1);
  });