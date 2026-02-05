import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const findUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}, 'email firstName');
        users.forEach(u => console.log(" "));
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
};

findUser();
