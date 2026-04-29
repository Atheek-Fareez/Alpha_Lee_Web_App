import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problemIdentifier: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['open', 'in_progress', 'resolved', 'closed'],
        default: 'open' 
    },
    adminNote: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);
