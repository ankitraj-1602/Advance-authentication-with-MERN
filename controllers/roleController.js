const User = require("../models/User");

const updateAssignedRole = async (req, res) => {
    try {
        const { role } = req.body;
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password -twoFA -isVerified')
        if(!user) return res.status(400).json({message:'User not found'})
        res.json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = updateAssignedRole;