import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DigitalProgram from './Models/DigitalProgram.js';

dotenv.config();

const programs = [
    {
        _id: "69ef20db50689ee74d33d8b9",
        title: "The Alpha Mass Protocol",
        shortTagline: "Engineered for maximum hypertrophy and metabolic density.",
        price: 4999,
        discountPrice: 2499,
        targetGoal: "Muscle",
        experienceLevel: "Intermediate",
        idealTime: "60-90 min",
        trainingType: "Hypertrophy",
        imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
        accessCode: "ALF-MASS-01",
        resultsCount: 1250,
        longDescription: "A comprehensive 12-week block designed to maximize muscle fiber recruitment and hormonal response. This protocol focuses on progressive overload through mechanical tension and metabolic stress.",
        equipmentNeeded: "Full Commercial Gym",
        sessions: []
    },
    {
        title: "Protocol 01: Strength Forge",
        shortTagline: "Master the big three and rebuild your foundation.",
        price: 3999,
        discountPrice: 1999,
        targetGoal: "Strength",
        experienceLevel: "Advanced",
        idealTime: "60-90 min",
        trainingType: "Powerbuilding",
        imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
        accessCode: "ALF-STR-02",
        resultsCount: 840,
        longDescription: "A high-intensity strength program focused on Squat, Bench, and Deadlift optimization. Built for those who want to move heavy weight and stay athletic.",
        equipmentNeeded: "Barbell, Rack, Plates",
        sessions: []
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.Mongo_Url);
        console.log(">>> Connected to MongoDB. Clearing existing records...");
        await DigitalProgram.deleteMany({});
        
        console.log(">>> Injecting Alpha Protocols...");
        const created = await DigitalProgram.insertMany(programs);
        
        console.log(">>> SEED SUCCESSFUL!");
        console.log("Available Program IDs for testing:");
        created.forEach(p => console.log(`- ${p.title}: http://localhost:5173/programs/${p._id}`));
        
        process.exit();
    } catch (e) {
        console.error("SEED FAILED:", e);
        process.exit(1);
    }
};

seedData();
