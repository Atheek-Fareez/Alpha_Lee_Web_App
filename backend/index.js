import 'dotenv/config';
import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import dns from "node:dns"; 


// import pages
import aiRouter from "./Routes/aiRoutes.js";
import userRouter from "./Routes/userRoutes.js";
import adminRouter from "./Routes/adminRoutes.js";
import coachingRouter from "./Routes/coachingRoutes.js";
import digitalRouter from "./Routes/digitalRoutes.js";
import exerciseRouter from "./Routes/exerciseRoutes.js";
import workoutRouter from "./Routes/workoutRoutes.js";
import blogRouter from "./Routes/blogRoutes.js";
import consultationRouter from "./Routes/consultationRoutes.js";
import feedbackRouter from "./Routes/feedbackRoutes.js";
import paymentRouter from "./Routes/paymentRoutes.js";
import recruitmentRouter from "./Routes/recruitmentRoutes.js";
import ticketRouter from "./Routes/ticketRoutes.js";
import chatRouter from "./Routes/chatRoutes.js";
import { createLead } from "./Controllers/adminController.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
app.use(cors());  

app.use((req, res, next) => {
    const authorizationHeader = req.header("Authorization");
   
   if(authorizationHeader != null){
        const token = authorizationHeader.replace("Bearer ", "")
        console.log("Authorization Token:", token);

         jwt.verify(token, process.env.JWT_SECRET, (error, content) => {
           if(error){
            console.log("Invalid token:", error.message);
           } else if(content){
            console.log("Token content:", content);
            req.user = content;
           }
        })
    }
    next();
});

app.use(express.json()); 

// routes
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/coaching", coachingRouter);
app.use("/api/digital-programs", digitalRouter);
app.use("/api/exercises", exerciseRouter);
app.use("/api/logs", workoutRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/consultations", consultationRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/recruitment", recruitmentRouter);
app.use("/api/support", ticketRouter);
app.use("/api/ai", aiRouter);
app.use("/api/chat", chatRouter);

// public decoupled routes
app.post("/api/apply/coaching", createLead);

const mongourl = process.env.Mongo_Url;
mongoose.connect(mongourl).then(() => {
    console.log("connected to db")
}).catch((err) => {
    console.log("Error connecting to db: " + err)
})


app.listen(3000, () => {
    console.log("Server started on port 3000");
});