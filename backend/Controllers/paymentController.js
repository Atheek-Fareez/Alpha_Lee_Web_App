import Payment from '../Models/Payment.js';
import User from '../Models/User.js';

// @desc    Submit a payment
// @route   POST /api/payments
export const submitPayment = async (req, res) => {
    try {
        const { programId, slipUrl } = req.body;
        const payment = new Payment({
            userId: req.user.id || req.user._id,
            programId,
            slipUrl,
            status: 'pending'
        });
        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit payment', details: error.message });
    }
};

// @desc    Get all pending payments for admin
// @route   GET /api/payments/pending
export const getPendingPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ status: 'pending' })
            .populate('userId', 'name email')
            .populate('programId', 'title')
            .sort({ createdAt: -1 });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pending payments', details: error.message });
    }
};

// @desc    Approve a pending payment
// @route   PUT /api/payments/:id/approve
export const approvePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { accessVector } = req.body;
        
        const payment = await Payment.findById(id);
        if (!payment) return res.status(404).json({ error: 'Payment not found' });
        
        payment.status = 'approved';
        payment.accessVector = accessVector;
        await payment.save();

        // Cross-Module Synergy: Automatically grant access to the user's Locker profile
        await User.findByIdAndUpdate(payment.userId, {
            $addToSet: { unlockedPrograms: payment.programId }
        });
        
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve payment', details: error.message });
    }
};

// @desc    Reject a pending payment
// @route   PATCH /api/payments/:id/reject
export const rejectPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id);
        if (!payment) return res.status(404).json({ error: 'Payment not found' });
        
        payment.status = 'rejected';
        payment.accessVector = ''; // Ensure no vector is accidentally issued
        await payment.save();
        
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject payment', details: error.message });
    }
};

// @desc    Get user's approved payments (for accessing vectors)
// @route   GET /api/payments/my-payments
export const getUserApprovedPayments = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const payments = await Payment.find({ userId })
            .populate('programId', 'title');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user payments', details: error.message });
    }
};
