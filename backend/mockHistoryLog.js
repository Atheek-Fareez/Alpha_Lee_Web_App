import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WorkoutLog from './models/WorkoutLog.js';

dotenv.config();

const mockHistory = async () => {
    try {
        await mongoose.connect(process.env.Mongo_Url || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/alphalee");
        console.log("Connected to Alpha Lee Database");

        // Grab any log
        const log = await WorkoutLog.findOne();
        
        if (!log) {
            console.log("⚠️ No workout logs exist in the system yet. Please create at least one log through the Frontend UI first.");
            process.exit(0);
        }

        console.log(`Found active log sequence for User: ${log.user}`);

        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

        // Ensure we add a previous session
        log.sets.push({
            setNumber: Math.floor(Math.random() * 10) + 1,
            weight: 80, // Sub-optimal prior weight to simulate 'Growth' in the new set
            reps: 10,
            dateRecorded: tenDaysAgo
        });

        // Add a current session
        log.sets.push({
            setNumber: Math.floor(Math.random() * 10) + 1,
            weight: 95, // Higher weight mapping
            reps: 12,
            dateRecorded: new Date()
        });
        
        await log.save();
        console.log("✅ Successfully injected backdated payload to simulate Past Analytics Session.");
        process.exit(0);

    } catch (err) {
        console.error("Injection failed:", err);
        process.exit(1);
    }
}

mockHistory();
