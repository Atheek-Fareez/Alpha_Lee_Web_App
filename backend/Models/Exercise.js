import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    videoUrl: { type: String },
    muscleGroup: { type: String, required: true },
    equipment: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Exercise", exerciseSchema);
