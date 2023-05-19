import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        uniqe: true
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const User = mongoose.model('user', userSchema);
export default User;