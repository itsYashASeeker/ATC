const express = require("express");
const dotenv = require("dotenv");
const app = express();
const bodyParser = require("body-parser");
const { notFoundPage, handleError } = require("../backend/middleware/errorHandler");
const cors = require("cors");
dotenv.config();

const connectDB = require("./config/connectDB");
const port = process.env.BKPORT || 5000;
const actRoutes = require("./routes/routes");

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var corsOptions = {
    // origin: process.env.FTPORT,
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
connectDB();



app.get("/", (req, res) => {
    res.send("Welcome to ACT");
});

app.use("/y", actRoutes);
app.use(notFoundPage);
app.use(handleError);

app.listen(port, () => {
    console.log(`Server started at ${port}`);
});