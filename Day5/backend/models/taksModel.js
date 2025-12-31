import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, MinLength: 3 },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        username: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }
)
export default mongoose.model("Task", taskSchema);