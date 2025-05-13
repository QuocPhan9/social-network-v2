import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";

//Creates an Express app - server
const app = express();

//Loads .env file into process.env
dotenv.config();

//Allow Express to parse incoming requests with JSON bdies(POST/PUT)
app.use(express.json());
//Allow app to parse URL-encoded data (from HTML forms)
app.use(express.urlencoded({ extended: true }));
//Allow Client give requests to server
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
//Helps to upload files
app.use(fileUpload());

//Run server in port 5000 and connect to DB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
