import DigitalProgram from "../Models/DigitalProgram.js";

// @desc    Get all digital programs (Public)
export const getDigitalPrograms = async (req, res) => {
    try {
        const programs = await DigitalProgram.find({}).sort({ createdAt: -1 });
        res.json(programs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch digital programs", error: error.message });
    }
};

// @desc    Get single digital program (Public)
export const getDigitalProgramById = async (req, res) => {
    try {
        console.log(`[ALF_API]: Fetching program detail for ID: ${req.params.id}`);
        const program = await DigitalProgram.findById(req.params.id)
                              .populate('sessions.exercises.exerciseId');
        if (program) {
            res.json(program);
        } else {
            console.warn(`[ALF_API]: Program NOT FOUND - ID: ${req.params.id}`);
            res.status(404).json({ message: "Program not found" });
        }
    } catch (error) {
        console.error(`[ALF_API]: CRITICAL_ERROR for ID ${req.params.id}:`, error.message);
        res.status(500).json({ message: "Failed to fetch program", error: error.message });
    }
}

// @desc    Create a digital program (Protected)
export const createDigitalProgram = async (req, res) => {
    try {
        const program = new DigitalProgram(req.body);
        const createdProgram = await program.save();
        res.status(201).json(createdProgram);
    } catch (error) {
        res.status(500).json({ message: "Failed to create program", error: error.message });
    }
};

// @desc    Update a digital program (Protected)
export const updateDigitalProgram = async (req, res) => {
    try {
        const updatedProgram = await DigitalProgram.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        );
        if (updatedProgram) {
            res.json(updatedProgram);
        } else {
            res.status(404).json({ message: "Program not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to update program", error: error.message });
    }
};

// @desc    Delete a digital program (Protected)
export const deleteDigitalProgram = async (req, res) => {
    try {
        const program = await DigitalProgram.findByIdAndDelete(req.params.id);
        if (program) {
            res.json({ message: "Program removed successfully" });
        } else {
            res.status(404).json({ message: "Program not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete program", error: error.message });
    }
};
