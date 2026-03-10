const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors"); // ✅ Ajout du package CORS
require("dotenv").config();

// --- Connexion MongoDB ---
const { connecttoMongoDB } = require("./config/db");

// --- Import des routes ---
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/userRouter");
const osRouter = require("./routes/osRouter");
const courseRouter = require("./routes/courseRouter");
const paymentRouter = require("./routes/PaymentRouter");
const reviewRouter = require("./routes/ReviewRouter");
const bookingRouter = require("./routes/BookingRouter");
const authRouter = require("./routes/authRouter"); // ✅ Auth ajouté
const chatRoutes = require("./routes/ChatRoutes");

const app = express();

// ✅ Configuration CORS - AJOUTEZ CETTE SECTION
app.use(cors({
  origin: [
    "http://192.168.1.118:30300",
    /^\/\/192\.168\./,
    "http://localhost:3000",    // React dev server
    "http://localhost:3001",    // Port alternatif
    "http://127.0.0.1:3000"     // Alternative localhost
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With",
    "Accept",
    "Origin"
  ]
}));

// --- Middlewares globaux ---
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Route de test pour vérifier que l'API fonctionne
app.get("/api/health", (req, res) => {
  res.json({ 
    message: "🚀 Backend API actif!", 
    timestamp: new Date().toISOString(),
    cors: "✅ Configuré pour localhost:3000"
  });
});
// --- Middleware de journalisation personnalisé pour les requêtes ---
// --- Routes principales ---
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/os", osRouter);
app.use("/courses", courseRouter);
app.use("/payments", paymentRouter);
app.use("/reviews", reviewRouter);
app.use("/bookings", bookingRouter);
app.use("/auth", authRouter); // ✅ API Auth (login)
app.use("/chat", chatRoutes);

// --- Catch 404 ---
app.use((req, res, next) => {
  next(createError(404));
});

// --- Error handler ---
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.error("❌ Erreur serveur:", err.message);
  res.status(err.status || 500).json({ 
    error: err.message,
    ...(req.app.get("env") === "development" && { stack: err.stack })
  });
});

// --- Démarrer le serveur ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connecttoMongoDB();
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`🌐 CORS configuré pour http://localhost:3000`);
  console.log(`✅ API Auth disponible sur http://localhost:${PORT}/auth/login`);
});

module.exports = app;