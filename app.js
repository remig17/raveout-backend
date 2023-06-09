require("dotenv").config();
require("./models/connections");
const mongoose = require("mongoose");

var express = require("express");

var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const fileUpload = require("express-fileupload");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var eventsRouter = require("./routes/events");

var app = express();
const cors = require("cors");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/events", eventsRouter);

module.exports = app;
