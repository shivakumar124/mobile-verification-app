const User = require('../models/user.model');
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

//const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendVerificationCode = async (req, res) => {
    const { phoneNumber } = req.body;
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
    const expiresIn = new Date(Date.now() + 2 * 60 * 1000); // Code expires in 2 minutes

    try {
        // await twilioClient.messages.create({
        //     body: `Your verification code is ${verificationCode}`,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: phoneNumber
        // });

        await User.findOneAndUpdate(
            { phoneNumber },
            { verificationCode, codeExpires: expiresIn, isVerified: false },
            { upsert: true }
        );

        return res.status(200).json({ message: "Verification code sent." });
    } catch (error) {
        return res.status(500).json({ message: "Error sending verification code.", error });
    }
};

exports.verifyCode = async (req, res) => {
    const { phoneNumber, verificationCode } = req.body;
    console.log("Date.now========",Date.now())

    try {
        const user = await User.findOne({ phoneNumber });
        console.log('code expiry========',user.codeExpires)
        // Convert expiry date string to a Date object
        const expiryDate = new Date(user.codeExpires);
        console.log("555555555555",expiryDate.getTime())
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
     // Compare the two dates
        if (expiryDate.getTime() < Date.now()) {
            return res.status(400).json({ message: "Verification code has expired." });
        }

        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: "Invalid verification code." });
        }

        user.isVerified = true;
        user.verificationCode = null;
        user.codeExpires = null;
        await user.save();

        const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ message: "Phone number verified!", token });
    } catch (error) {
        return res.status(500).json({ message: "Error verifying code.", error });
    }
};