require("dotenv").config();
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const app = express();
const main = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authentication");
const redisClient = require("./config/redis");
const problemRouter = require("./routes/problems");
const profileRouter = require("./routes/profile");
const submissionRouter = require("./routes/submissions");
const solutionVideoRouter = require('./routes/solutionVideo');
const adminRouter = require('./routes/admin');
const aiRouter = require("./routes/ai");
const cors = require("cors");


app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

// ========== KEEP-ALIVE / PING ENDPOINTS ==========
// Simple ping endpoint for UptimeRobot and keep-alive
app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});

// Detailed health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: "Server is awake and running"
  });
});
// ================================================

app.use("/authentication", authRouter);
app.use("/profile", profileRouter);
app.use("/problems", problemRouter);
app.use("/submissions", submissionRouter);
app.use("/ai", aiRouter);
app.use("/solution-video", solutionVideoRouter);
app.use("/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("Backend is running! 🚀");
});

const InitializeConnections = async () => {
    try {
        // connecting with database and redis
        await Promise.all([main(), redisClient.connect()]);

        // starting server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`HackForge server started on port ${PORT}`);
            console.log(`✅ Ping endpoint: /ping`);
            console.log(`✅ Health endpoint: /api/health`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

InitializeConnections()