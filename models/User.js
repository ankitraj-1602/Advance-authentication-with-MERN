const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: function(){
            return !this.googleId
        }
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: String,
    verificationTokenExpiry: Date,

    resetToken: String,
    resetTokenExpiry: Date,

    googleId: {
        type: String,
        unique: true,
        sparse: true
    },

    role:{
        type:String,
        enum:['user','admin','manager'],
        default:'user'
    },

    // field for two FA 
    twoFA:{
        enabled:{type:Boolean, default:false},
        secret:{type:String}
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)