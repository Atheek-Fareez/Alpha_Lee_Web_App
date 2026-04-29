import Feedback from '../Models/Feedback.js';

// ** PUBLIC / USER ENDPOINTS **

export const createFeedback = async (req, res) => {
    try {
        // The middleware sets req.user = { id, role }
        if (!req.user || !req.user.id) {
            return res.status(401).json({message: "Unauthorized User"});
        }
        
        const feedback = new Feedback({
            userId: req.user.id,
            rating: req.body.rating,
            comment: req.body.comment
        });
        await feedback.save();
        res.status(201).json({ message: "Thank you! Your review is being moderated by the Alpha Team." });
    } catch (err) {
        console.error("Feedback Creation Exception:", err);
        res.status(500).json({ message: "Network Offline.", error: err.message });
    }
};

export const getFeaturedFeedback = async (req, res) => {
    try {
        // Only return Approved AND Featured feedback
        const testimonials = await Feedback.find({ status: 'Approved', isFeatured: true })
            .populate('userId', 'firstName lastName') // Using correct fields
            .sort({ createdAt: -1 });
        
        res.json(testimonials || []);
    } catch (err) {
        console.error("Featured Fetch Exception:", err);
        res.status(500).json({ message: "Database Error", error: err.message });
    }
};


// ** ADMIN ENDPOINTS **

export const getAdminFeedback = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({message: "Access Denied"});
        }

        const allFeedback = await Feedback.find({})
            .populate('userId', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.json(allFeedback || []);
    } catch (err) {
        console.error("Admin Fetch Exception:", err);
        res.status(500).json({ message: "System Error", error: err.message });
    }
};

export const moderateFeedback = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({message: "Access Denied"});
        }

        const { status, isFeatured } = req.body;
        
        const updated = await Feedback.findByIdAndUpdate(
            req.params.id, 
            { status, isFeatured }, 
            { new: true }
        ).populate('userId', 'firstName lastName email');
        
        res.json(updated);
    } catch (err) {
        console.error("Moderation Exception:", err);
        res.status(500).json({ message: "Update Failed.", error: err.message });
    }
};
