import Recruitment from '../Models/Recruitment.js';

// @desc Submit a new job application
// @route POST /api/recruitment/apply
// @access Public
export const applyForTeam = async (req, res) => {
    try {
        const { name, email, position, expectedSalary, message } = req.body;
        
        if (!name || !email || !position || !expectedSalary || !message) {
            return res.status(400).json({ error: 'Please provide all required fields.' });
        }

        const application = new Recruitment({
            name, email, position, expectedSalary, message
        });

        await application.save();
        res.status(201).json({ message: 'Application submitted successfully!', application });

    } catch (error) {
        res.status(500).json({ error: 'Failed to submit application.', details: error.message });
    }
};

// @desc Get all job applications
// @route GET /api/recruitment/applications
// @access Private (Admin)
export const getApplications = async (req, res) => {
    try {
        const applications = await Recruitment.find().sort({ dateApplied: -1 });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve applications.', details: error.message });
    }
};

// @desc Delete an application
// @route DELETE /api/recruitment/applications/:id
// @access Private (Admin)
export const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Recruitment.findByIdAndDelete(id);
        
        if (!result) return res.status(404).json({ error: 'Application not found.' });

        res.status(200).json({ message: 'Application securely deleted.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete application.', details: error.message });
    }
};
