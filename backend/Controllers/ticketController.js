import Ticket from '../Models/Ticket.js';

export const createTicket = async (req, res) => {
    try {
        const { problemIdentifier, description } = req.body;
        const newTicket = await Ticket.create({
            user: req.user.id,
            problemIdentifier,
            description,
            status: 'open'
        });
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getUserTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({}).populate('user', 'firstName lastName email').sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateTicketStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        const ticket = await Ticket.findById(id);

        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

        const isAdmin = req.user.role === 'admin';
        const isOwner = ticket.user.toString() === req.user.id;
        const currentStatus = ticket.status;

        let allowed = false;

        if (isAdmin) {
            // Admins have full lifecycle authority - allow any valid enum state
            allowed = true; 
        }

        if (isOwner && currentStatus === 'resolved' && status === 'closed') {
            allowed = true;
        }

        if (!allowed) {
            return res.status(403).json({ message: `Invalid status transition from ${currentStatus} to ${status}` });
        }

        ticket.status = status;
        await ticket.save();
        res.status(200).json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const adminUpdateTicket = async (req, res) => {
    try {
        const { problemIdentifier, description, adminNote, status } = req.body;
        
        // Use findByIdAndUpdate for a more robust update that bypasses issues with other required fields like 'user'
        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { 
                $set: { 
                    problemIdentifier, 
                    description, 
                    adminNote, 
                    status 
                } 
            },
            { new: true, runValidators: true }
        );

        if (!updatedTicket) return res.status(404).json({ message: "Ticket not found" });

        res.status(200).json(updatedTicket);
    } catch (error) {
        console.error("ADMIN_TICKET_UPDATE_FAILED:", error);
        res.status(400).json({ message: error.message });
    }
};

export const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

        // As per requirement: ONLY delete if status is closed
        if (ticket.status !== 'closed') {
            return res.status(403).json({ message: "Only closed tickets can be deleted from the archive." });
        }

        await Ticket.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Ticket permanently removed from archives." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
