import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Feedback from './Models/Feedback.js';

dotenv.config();

const fixFeedback = async () => {
    try {
        await mongoose.connect(process.env.Mongo_Url);
        console.log(">>> Connected. Setting all Approved feedback to Featured...");
        const result = await Feedback.updateMany(
            { status: 'Approved' },
            { $set: { isFeatured: true } }
        );
        console.log(`>>> Updated ${result.modifiedCount} records.`);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

fixFeedback();
