import mongoose from "mongoose";

const coachingPackageSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 3, unique: true },
    subtitle: { type: String },
    price: { type: Number, required: true, min: 0 },
    features: { type: [String], required: true },
    tier: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("CoachingPackage", coachingPackageSchema);
