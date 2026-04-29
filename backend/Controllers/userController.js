import User from "../Models/User.js";

// crate user 
export async function registerUser(req, res) {
    try {
        const data = req.body;

        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = bcrypt.hashSync(data.password, 10);

        const newUser = new User({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,      
            image: data.image || "/default-profile.png",
            address: data.address || "",
            phone: data.phone || "",
            role: data.role || "user" // Default role- user 
        });

        const result = await newUser.save();
        res.status(201).json({
            message: "User created successfully",
            user: result,
        });

    } catch (err) {
        console.error("Register Error:", err); 
        res.status(500).json({ message: "Error creating user", error: err.message });
    }
}