import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, default: 'User' },
    isVerified: { type: Boolean, default: false },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    oauthId: { type: String }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
