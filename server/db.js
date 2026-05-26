import mongoose from "mongoose";


export async function connectDB() {
    const MONGO_URI=process.env.MONGO_URI||"mongodb+srv://ajaymb:ajaymb2003@mydatabase.4xqyrdt.mongodb.net/mentallwellnessapp"
    try {
        await mongoose.connect(MONGO_URI)
        console.log("MongoDB connected")
    } catch (error) {
        console.log("MongoDB error-",error)
    }
}