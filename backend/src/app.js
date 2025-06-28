import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import {config} from "dotenv";
// import errorHandler from "./middlewares/errorHandler.js";
config({
    path : "./.env"   
})


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit:"36kb"})); // when data coming in json formate 
app.use(express.urlencoded({extended:true, limit:"36kb"})) //when data coming from url
app.use(express.static("public")) //public access to all the files in public folder
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Welcome to BookSnap API");
})

import bookRouter from "./routes/book.route.js";

app.use("/api/v1/book", bookRouter);
//app.use(errorHandler);
export {app};
