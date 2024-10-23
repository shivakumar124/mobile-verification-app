const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    verificationCode: { type: String },
    isVerified: { type: Boolean, default: false },
    codeExpires: { type: Date }
});

module.exports = mongoose.model('User', userSchema);