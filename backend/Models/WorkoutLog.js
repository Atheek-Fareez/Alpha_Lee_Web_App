import mongoose from "mongoose";

const workoutLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    program: { type: mongoose.Schema.Types.ObjectId, ref: 'DigitalProgram', required: true },
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    dateRecorded: { type: Date, default: Date.now },
    sets: [{
        setNumber: Number,
        weight: Number,
        reps: Number,
        dateRecorded: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model("WorkoutLog", workoutLogSchema);
