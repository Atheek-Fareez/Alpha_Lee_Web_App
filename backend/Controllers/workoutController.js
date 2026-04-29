import WorkoutLog from "../Models/WorkoutLog.js";
import mongoose from "mongoose";

export const logSets = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not Authenticated" });
        
        const { programId, exerciseId, setsData } = req.body;
        
        // Find existing ledger for this specific exercise
        let log = await WorkoutLog.findOne({
            user: req.user.id,
            program: programId,
            exercise: exerciseId
        });

        if (!log) {
            log = new WorkoutLog({
                user: req.user.id,
                program: programId,
                exercise: exerciseId,
                sets: []
            });
        }

        // We append the new sets mapping the current Date
        const dateRecorded = new Date();
        const modeledSets = setsData.map(s => ({
            ...s,
            dateRecorded
        }));

        log.sets.push(...modeledSets);
        await log.save();

        res.json({ message: "Sets logged cleanly", log });
    } catch (error) {
        res.status(500).json({ message: "Failed to log sets", error: error.message });
    }
};

export const getLastLifts = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not Authenticated" });
        
        const { programId } = req.params;
        
        // Return all logs for this user matching this program. 
        // The dashboard UI can map it natively finding the highest date payload per exercise.
        const logs = await WorkoutLog.find({
            user: req.user.id,
            program: programId
        });

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch ledger", error: error.message });
    }
};

export const getWorkoutAnalytics = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not Authenticated" });
        const { exerciseId } = req.params;
        const userId = req.user.id || req.user._id;

        const pipeline = [
            { $match: { user: new mongoose.Types.ObjectId(userId.toString()), exercise: new mongoose.Types.ObjectId(exerciseId.toString()) } },
            { $unwind: "$sets" },
            { $project: {
                _id: 0,
                volume: { $multiply: ["$sets.weight", "$sets.reps"] },
                weight: "$sets.weight",
                reps: "$sets.reps",
                date: "$sets.dateRecorded"
            }},
            { $group: {
                _id: "$date",
                sessionVolume: { $sum: "$volume" },
                maxWeight: { $max: "$weight" }
            }},
            { $sort: { _id: -1 } },
            { $limit: 2 }
        ];

        const sessions = await WorkoutLog.aggregate(pipeline).allowDiskUse(true);

        if (!sessions || sessions.length === 0) {
            return res.json({ volumeGrowthPercentage: 0, plateauStatus: false, message: "No data" });
        }

        const latest = sessions[0];
        const previous = sessions.length > 1 ? sessions[1] : null;

        let volumeGrowthPercentage = 0;
        let plateauStatus = false;
        
        if (previous && previous.sessionVolume > 0) {
            const diff = latest.sessionVolume - previous.sessionVolume;
            volumeGrowthPercentage = (diff / previous.sessionVolume) * 100;
            if (volumeGrowthPercentage <= 0) plateauStatus = true;
        }

        res.json({
            volumeGrowthPercentage: Math.round(volumeGrowthPercentage * 100) / 100,
            suggestedWeight: (latest.maxWeight || 0) + 2.5,
            suggestedReps: 2,
            plateauStatus
        });
        
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: "Analytics Server Error", error: error.message });
    }
};
