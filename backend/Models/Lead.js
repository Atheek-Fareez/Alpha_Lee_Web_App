import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    whatsapp_number: { type: String, required: true },
    program_choice: { type: String, required: false },
    fitness_goal: { type: String, required: false },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);
