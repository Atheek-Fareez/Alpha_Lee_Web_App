import Lead from "../Models/Lead.js";
import Program from "../Models/Program.js";

// @desc    Fetch all leads (Protected)
export const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find({}).sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch leads", error: error.message });
    }
};

// @desc    Delete a lead (Protected)
export const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (lead) {
            res.json({ message: "Lead removed successfully" });
        } else {
            res.status(404).json({ message: "Lead not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete lead", error: error.message });
    }
};

// @desc    Create a new training program (Protected)
export const createProgram = async (req, res) => {
    try {
        const program = new Program(req.body);

        const createdProgram = await program.save();
        res.status(201).json(createdProgram);
    } catch (error) {
        res.status(500).json({ message: "Failed to create program", error: error.message });
    }
};

// @desc    Update an existing training program (Protected)
export const updateProgram = async (req, res) => {
    try {
        const updatedProgram = await Program.findByIdAndUpdate(
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

// @desc    Delete a training program (Protected)
export const deleteProgram = async (req, res) => {
    try {
        const program = await Program.findByIdAndDelete(req.params.id);
        if (program) {
            res.json({ message: "Program removed successfully" });
        } else {
            res.status(404).json({ message: "Program not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete program", error: error.message });
    }
};

// @desc    Get all training programs (Public)
export const getPrograms = async (req, res) => {
    try {
        const programs = await Program.find({}).sort({ createdAt: -1 });
        res.json(programs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch programs", error: error.message });
    }
};

// @desc    Create a lead (Public)
export const createLead = async (req, res) => {
    try {
        const { full_name, whatsapp_number, program_choice, fitness_goal } = req.body;

        const lead = new Lead({
            full_name,
            whatsapp_number,
            program_choice,
            fitness_goal
        });

        const createdLead = await lead.save();
        res.status(201).json(createdLead);
    } catch (error) {
        res.status(500).json({ message: "Failed to create lead", error: error.message });
    }
};
