import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import dns from "node:dns";
import User from "./Models/User.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const createAdmin = async () => {
    try {
        const mongoUrl = process.env.Mongo_Url;
        if (!mongoUrl) {
            console.error("Error: Mongo_Url is not defined in .env");
            process.exit(1);
        }

        await mongoose.connect(mongoUrl);
        console.log("Database Connection Established.");

        const email = 'admin@alphalee.com';
        const adminExists = await User.findOne({ email });

        if (adminExists) {
            console.log("An admin with this email already exists in the database.");
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('ALPHA_PRO_2026', salt);

        const newAdmin = new User({
            firstName: 'Alpha',
            lastName: 'Lee',
            email: email,
            password: hashedPassword,
            role: 'admin'
        });

        await newAdmin.save();
        console.log("ADMIN_PROTOCOL_INITIALIZED");
        process.exit(0);
    } catch (error) {
        console.error("Critical Error during admin initialization:", error);
        process.exit(1);
    }
};

createAdmin();
