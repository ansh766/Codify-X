const jwt = require("jsonwebtoken");
const User = require("../../models/users");
const password = require("../../utils/password");

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: "Token and new password are required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if (decoded.purpose !== 'reset-password') {
            return res.status(400).json({ error: "Invalid token" });
        }

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const hashedPassword = await password.hash(newPassword);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
        console.error("Reset Password Error:", error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ error: "Invalid or expired token" });
        }
        
        res.status(500).json({ error: "Failed to reset password" });
    }
};

module.exports = resetPassword;
