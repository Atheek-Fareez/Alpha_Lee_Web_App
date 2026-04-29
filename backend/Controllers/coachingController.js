import CoachingPackage from "../Models/CoachingPackage.js";

// @desc    Get all coaching packages (Public)
export const getCoachingPackages = async (req, res) => {
    try {
        const packages = await CoachingPackage.find({}).sort({ createdAt: 1 });
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch coaching packages", error: error.message });
    }
};

// @desc    Create a coaching package (Protected)
export const createCoachingPackage = async (req, res) => {
    try {
        const coaching = new CoachingPackage(req.body);
        const createdPackage = await coaching.save();
        res.status(201).json(createdPackage);
    } catch (error) {
        res.status(500).json({ message: "Failed to create coaching package", error: error.message });
    }
};

// @desc    Update a coaching package (Protected)
export const updateCoachingPackage = async (req, res) => {
    try {
        const updatedPackage = await CoachingPackage.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        );
        if (updatedPackage) {
            res.json(updatedPackage);
        } else {
            res.status(404).json({ message: "Package not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update package", error: error.message });
    }
};

// @desc    Delete a coaching package (Protected)
export const deleteCoachingPackage = async (req, res) => {
    try {
        const pkg = await CoachingPackage.findByIdAndDelete(req.params.id);
        if (pkg) {
            res.json({ message: "Package removed successfully" });
        } else {
            res.status(404).json({ message: "Package not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete package", error: error.message });
    }
};
