const express= require('express');
let app = express();

require('./config/DB');
const dotenv = require('dotenv');

const session=require('express-session');
const sessionConfig=require('./config/session');
const flash=require("connect-flash");

app.use(express.urlencoded({ extended : true }));
app.use(session(sessionConfig));
app.use(express.json())
app.use(flash());




const authRoutes = require("./routes/authRoutes");
const truckRoutes = require("./routes/truckRoutes");
// const trailerRoutes = require("./routes/trailerRoutes");
// const tireRoutes = require("./routes/tireRoutes");
// const tripRoutes = require("./routes/tripRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/trucks", truckRoutes);
// app.use("/api/trailers", trailerRoutes);
// app.use("/api/tires", tireRoutes);
// app.use("/api/trips", tripRoutes);



app.listen(process.env.PORT);