import mongoose from "mongoose";

const digitalProgramSchema = new mongoose.Schema({
    title: { type: String, required: true },
    shortTagline: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    targetGoal: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    idealTime: { type: String, required: true },
    trainingType: { type: String, required: true },
    imageUrl: { type: String, required: true },
    videoPreviewUrl: { type: String },
    accessCode: { type: String, required: true },
    resultsCount: { type: Number, default: 0 },
    longDescription: { type: String },
    equipmentNeeded: { type: String },
    sessions: [{
        dayName: { type: String },
        weekBlock: { type: String },
        exercises: [{
            exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
            sets: { type: String },
            reps: { type: String },
            tempo: { type: String },
            rir: { type: String },
            rest: { type: String },
            notes: { type: String }
        }]
    }],
    reviews: [{
        user: String,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model("DigitalProgram", digitalProgramSchema);
