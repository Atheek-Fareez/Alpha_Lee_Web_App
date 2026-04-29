import mongoose from "mongoose";

const programSchema = new mongoose.Schema({
    title: { type: String, required: true },
    original_price: { type: String },
    discounted_price: { type: String, required: true },
    duration_months: { type: String, required: true },
    description: { type: String },
    features: { type: String },
    goal: { type: String },
    experienceLevel: { type: String },
    trainingType: { type: String },
    sessionTime: { type: String },
    frequency: { type: String },
    imageUrl: { type: String },
    accessCode: { type: String }
}, { timestamps: true });

export default mongoose.model("Program", programSchema);
