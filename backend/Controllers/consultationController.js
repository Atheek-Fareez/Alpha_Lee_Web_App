import ConsultationPackage from "../Models/ConsultationPackage.js";
import Booking from "../Models/Booking.js";

// -- PACKAGES CMS --
export const getPackages = async (req, res) => {
    try {
        const packages = await ConsultationPackage.find({});
        res.json(packages);
    } catch (err) {
        res.status(500).json({ message: "Network Offline" });
    }
};

export const createPackage = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') return res.status(403).json({message: "Unauthorized"});
        const pkg = new ConsultationPackage(req.body);
        await pkg.save();
        res.status(201).json(pkg);
    } catch (err) {
        res.status(500).json({ message: "Failed to generate package.", error: err.message });
    }
};

export const updatePackage = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') return res.status(403).json({message: "Unauthorized"});
        const pkg = await ConsultationPackage.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(pkg);
    } catch (err) {
        res.status(500).json({ message: "Failed to update package." });
    }
};

export const deletePackage = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') return res.status(403).json({message: "Unauthorized"});
        await ConsultationPackage.findByIdAndDelete(req.params.id);
        res.json({ message: "Package terminated." });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete package." });
    }
};

// -- BOOKINGS LOGIC --
export const createBooking = async (req, res) => {
    try {
        const { fullName, email, whatsappNumber, selectedPackage } = req.body;
        const booking = new Booking({
            userId: req.user ? req.user._id : undefined,
            fullName,
            email,
            whatsappNumber,
            selectedPackage
        });
        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ message: "Intake logic failed to process securely.", error: err.message });
    }
};

export const getBookings = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') return res.status(403).json({message: "Unauthorized"});
        const bookings = await Booking.find({}).populate('selectedPackage').sort({createdAt: -1});
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Lead Tracker Offline" });
    }
};

export const markContacted = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') return res.status(403).json({message: "Unauthorized"});
        const booking = await Booking.findByIdAndUpdate(req.params.id, {status: 'Contacted'}, {new: true});
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: "Failed to update tracker." });
    }
};
