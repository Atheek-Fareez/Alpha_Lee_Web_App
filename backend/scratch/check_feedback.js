import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Feedback from '../Models/Feedback.js';
import User from '../Models/User.js';

dotenv.config();

const checkFeedback = async () => {
    try {
        await mongoose.connect(process.env.Mongo_Url);
        const all = await Feedback.find({}).populate('userId', 'firstName lastName');
        console.log(`Total Feedback in DB: ${all.length}`);
        
        all.forEach(f => {
            console.log(`- [${f.status}] Featured: ${f.isFeatured} | User: ${f.userId?.firstName} | Comment: ${f.comment.substring(0, 20)}...`);
        });
        
        const featured = await Feedback.find({ isFeatured: true, status: 'Approved' });
        console.log(`\nFeedback that SHOULD show on Home: ${featured.length}`);
        
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkFeedback();
