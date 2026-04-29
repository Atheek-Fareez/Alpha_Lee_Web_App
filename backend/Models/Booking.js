import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    selectedPackage: { type: mongoose.Schema.Types.ObjectId, ref: 'ConsultationPackage', required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Contacted'], 
        default: 'Pending' 
    }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
