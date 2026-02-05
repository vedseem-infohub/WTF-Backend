import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json();
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      emailVerificationOTP: otp,
      otpExpiry,
      isEmailVerified: false,
    });

    await user.save();

    res.status(201).json({
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json();
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json();
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json();
    }

    if (user.isEmailVerified) {
      return res.status(400).json();
    }
    if (new Date() > user.otpExpiry) {
      return res.status(400).json();
    }

    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json();
    }
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json();
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json();
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json();
    }

    if (user.isEmailVerified) {
      return res.status(400).json();
    }
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.emailVerificationOTP = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    res.status(200).json();
  } catch (error) {
    res.status(500).json();
  }
};
