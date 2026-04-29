import mongoose from "mongoose";

const consultationPackageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    priceLKR: { type: Number, required: true },
    description: { type: String, required: true },
    type: { 
        type: String, 
        required: true,
        enum: ['In-Person', 'Video', 'Voice', 'WhatsApp'] 
    }
}, { timestamps: true });

export default mongoose.model("ConsultationPackage", consultationPackageSchema);
