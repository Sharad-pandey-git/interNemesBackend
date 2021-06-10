const express = require("express");
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

//Importing Routes
const authRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");

//Connecting mongodb 
mongoose.connect(process.env.DATABASE , {
    useNewUrlParser: true , useUnifiedTopology: true , useCreateIndex: true }
    ).then(()=>{
        console.log('Custom - DB Connected')
    },
    error=>{ console.log("Custom - PRoblem to Connect to Database") }
    );

//const port = process.env.PORT ;
const port = process.env.PORT || 8000

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
    res.send("<h3>HOME PAGE<h3/>")
})

app.use("/api",  authRoutes);
app.use("/api",  userRoutes);


//PORT
app.listen(port , ()=>{
    console.log("THE SErver is up and runnning on local host", port)
})