import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DigitalProgram from '../Models/DigitalProgram.js';

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.Mongo_Url);
        const programs = await DigitalProgram.find({});
        console.log("Total Programs:", programs.length);
        programs.forEach(p => {
            console.log(`- ID: ${p._id}, Title: ${p.title}`);
        });
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkDB();
