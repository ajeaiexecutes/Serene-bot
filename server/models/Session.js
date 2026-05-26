import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    userId: { type: String },
    title: { type: String }
}, { timestamps: true });

export const Session = mongoose.model('Session', sessionSchema);
