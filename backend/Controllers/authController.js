import User from "../Models/User.js";
import DigitalProgram from "../Models/DigitalProgram.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

// Generate JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, role } = req.body;

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already registered" });
        }

        if (username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res.status(400).json({ message: "Username already taken" });
            }
        }

        if (password.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/\d/.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters, and contain at least one symbol and number." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName,
            lastName,
            username: username || undefined,
            email,
            password: hashedPassword,
            role: role || "user"
        });

        if (user) {
            // TRIGGER WELCOME EMAIL SEQUENCE
            const emailTemplate = `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; background-color: #111; color: #fff; max-width: 600px; margin: auto; border: 1px solid #333; border-radius: 8px;">
                    <h2 style="color: #ff5540; text-transform: uppercase; border-bottom: 2px solid #00ccff; padding-bottom: 10px;">Welcome to the Alpha Lee Ecosystem, ${firstName}!</h2>
                    <p style="font-size: 16px; line-height: 1.6; color: #ddd;">
                        We are thrilled to officially welcome you to the platform. 
                        Forget about guesswork—at Alpha Lee Fitness, every protocol, diet block, and movement is grounded strictly in <strong>Evidence-Based practices</strong> to force biological adaptation.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; color: #ddd;">
                        Discover our genesis and the exact Core Values that drive our periodization engines:
                    </p>
                    <a href="http://localhost:5173/about" style="display: inline-block; padding: 12px 25px; margin-top: 20px; background-color: #00ccff; color: #000; text-decoration: none; font-weight: 900; border-radius: 4px; text-transform: uppercase;">Read the ALF Origin Story</a>
                    <br/><br/>
                    <p style="font-size: 14px; color: #aaa; margin-top: 30px; border-top: 1px solid #333; padding-top: 15px;">
                        Train safe, train hard.<br/>
                        <strong>Coach Admin Team</strong>
                    </p>
                </div>
            `;

            // Fire and forget (don't await strictly to prevent bottlenecking the UX)
            sendEmail({
                email: user.email,
                subject: `Welcome to the Alpha Lee Ecosystem, ${firstName}!`,
                html: emailTemplate
            });

            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // email variable here tracks the raw input string, which could be an email OR username
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: email }
            ]
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

export const claimProgram = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not Authenticated" });
        
        const { programId } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Merge logic: If program not already unlocked, add it.
        if (!user.unlockedPrograms.includes(programId)) {
            user.unlockedPrograms.push(programId);
            await user.save();
        }

        res.json({ message: "Program universally claimed to Locker", unlockedPrograms: user.unlockedPrograms });
    } catch (error) {
        res.status(500).json({ message: "Failed to claim program", error: error.message });
    }
};

export const getLocker = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not Authenticated" });

        const user = await User.findById(req.user.id).populate('unlockedPrograms');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user.unlockedPrograms);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch locker", error: error.message });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Failed to load profile details", error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: "Password is required to delete account" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        await User.findByIdAndDelete(req.user.id);
        res.json({ message: "User completely removed from system" });
    } catch (error) {
        res.status(500).json({ message: "Failed to terminate account", error: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { currentPassword, newPassword } = req.body;

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: "Current password incorrect" });

        if (newPassword.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) || !/\d/.test(newPassword)) {
            return res.status(400).json({ message: "New password must be at least 8 characters, and contain at least one symbol and number." });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to change password", error: error.message });
    }
};
