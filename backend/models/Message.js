import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    file: String
}, { timestamps: true })

const Message = mongoose.model('message', messageSchema);
export default Message;