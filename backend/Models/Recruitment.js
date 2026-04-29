import mongoose from 'mongoose';

const recruitmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    position: { type: String, enum: ['Coaching', 'Sales', 'Development'], required: true },
    expectedSalary: { type: Number, required: true },
    message: { type: String, required: true }, // 'Why ALF?'
    status: { type: String, enum: ['pending', 'reviewed', 'rejected'], default: 'pending' },
    dateApplied: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Recruitment', recruitmentSchema);
