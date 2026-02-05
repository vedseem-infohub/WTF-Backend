import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, phone, password, addresses } = req.body;
  const filteredAddresses = addresses ? addresses.filter(addr => addr.trim() !== '') : [];

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      addresses: filteredAddresses,
      isEmailVerified: true,
    });

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        addresses: newUser.addresses,
        isEmailVerified: newUser.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// router.post('/verify-otp', async (req, res) => {
//   const { userId, otp } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (user.isEmailVerified) {
//       return res.status(400).json({ message: 'Email already verified' });
//     }

//     if (new Date() > user.otpExpiry) {
//       return res.status(400).json({ message: 'OTP expired. Please request a new one' });
//     }

//     if (user.emailVerificationOTP !== otp) {
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }

//     user.isEmailVerified = true;
//     user.emailVerificationOTP = undefined;
//     user.otpExpiry = undefined;
//     await user.save();

//     const token = generateToken(user);

//     res.status(200).json({
//       message: 'Email verified successfully',
//       token,
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         addresses: user.addresses,
//         isEmailVerified: user.isEmailVerified,
//       },
//     });
//   } catch (error) {
//     console.error('OTP verification error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// router.post('/resend-otp', async (req, res) => {
//   const { userId } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (user.isEmailVerified) {
//       return res.status(400).json({ message: 'Email already verified' });
//     }

//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//     user.emailVerificationOTP = otp;
//     user.otpExpiry = otpExpiry;
//     await user.save();

//     await sendOTPEmail(user.email, otp, user.firstName);

//     res.status(200).json({ message: 'OTP resent successfully' });
//   } catch (error) {
//     console.error('Resend OTP error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid credentials' });
    }



    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json();
  }
});

export default router;
