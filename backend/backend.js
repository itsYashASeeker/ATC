const express = require("express");
const dotenv = require("dotenv");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config();

const connectDB = require("./config/connectDB");
const port = process.env.BKPORT || 5000;
const actRoutes = require("./routes/routes");

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Credentials", true)
//     next();
// });

var corsOptions = {
    // origin: process.env.FTPORT,
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true
}

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
connectDB();



app.get("/", (req, res) => {
    res.send("Welcome to ACT");
});

app.use("/y", actRoutes);

app.listen(port, () => {
    console.log(`Server started at ${port}`);
});