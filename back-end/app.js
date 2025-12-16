const express = require("express");
let app = express();
const cors = require("cors");
require("./config/DB");
const dotenv = require("dotenv");
dotenv.config();

const session = require("express-session");
const sessionConfig = require("./config/session");
const flash = require("connect-flash");

app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(express.json());
app.use(flash());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
 

const authRoutes = require("./routes/authRoutes");
const truckRoutes = require("./routes/truckRoutes");
const trailerRoutes = require("./routes/trailerRoutes");
const tireRoutes = require("./routes/tireRoutes");
const tripRoutes = require("./routes/tripRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/trucks", truckRoutes);
app.use("/api/trailers", trailerRoutes);
app.use("/api/tires", tireRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/users", userRoutes);

app.listen(process.env.PORT);
