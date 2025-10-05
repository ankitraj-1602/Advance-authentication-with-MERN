const Role = require("../models/Role");
const User = require("../models/User");

const createRole = async (req,res) => {
    try {
        const {role,permission} =req.body;
        const roleExists = await Role.findOne({role});
        if(roleExists) return res.status(400).json({message:'Role already exists'});
        const newRole = await Role.create({role,permission});
        res.status(201).json({message:'Role created'})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
}

const getAllRole = async (req,res) => {
    try {
        const roles = await Role.find();
        res.status(200).json({roles});
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
    }
}

const addPermissionToRole = async (req,res) => {
    try {
        const {roleId} = req.params;
        const {permission} = req.body;
        const role = await Role.findById(roleId);
        if(!role) return res.status(400).json({message:'Role not found'})
        if(role.permission.includes(permission)){
            return res.status(400).json({message:'Permission already exists'})
        }
        role.permission.push(permission);
        await role.save();
        res.status(200).json({message:'Permission added to the Role'})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
}

const removePermissionFromRole = async(req,res) => {
    try {
        const {roleId} = req.params;
        const {permission} = req.body;
        const role = await Role.findById(roleId);
        if(!role) return res.status(400).json({message:'Role not found'})
        role.permission = role.permission.filter(r=>r!==permission);
        await role.save();
        res.status(200).json({message:'Permission is removed'})
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message});
    }
}

const assignRoleToUser = async (req,res) => {
    try {
        const {userId} = req.params;
        const {roleId} = req.body;
        const user = await User.findById(userId);
        const role = await Role.findById(roleId);
        if(!role) return res.status(400).json({message:'Role not found'})
        if(!user) return res.status(400).json({message:'User not found'})
        
        user.role = role._id;
        console.log(user)
        await user.save();
        res.status(200).json({message:'Role is successfully assigned to User'})


    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
}

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

module.exports = {createRole,getAllRole,updateAssignedRole,assignRoleToUser,addPermissionToRole,removePermissionFromRole};