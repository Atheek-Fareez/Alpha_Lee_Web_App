import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    programId: { type: mongoose.Schema.Types.ObjectId, ref: 'DigitalProgram', required: true },
    slipUrl: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    accessVector: { type: String }
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
