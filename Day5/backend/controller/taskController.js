import Task from '../models/taksModel.js';

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user._id });
        res.status(200).json(tasks);
    } catch (err) {
        console.error("Get Tasks Error", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getTaskByUserId = async (req, res) =>{
    try{
        const tasks = await Task.find({ userId: req.user._id });
        if(tasks.length === 0){
            return res.status(404).json({ message: "No tasks found" });
        }
        res.status(200).json(tasks);
    } catch (err) {
        console.error("Get Tasks By User ID Error", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const createTask = async (req, res) => {
    try {
        const { title } = req.body;
        const task = new Task({ title, userId: req.user.id, username: req.user.username });
        await task.save();
        res.status(201).json({
            message: "Task created successfully", 
            success: true, 
            task: {
                _id: task._id,
                title: task.title,
                userId: task.userId,
                username: task.username,
                createdAt: task.createdAt
            }
        });
    } catch (err) {
        console.error("Create Task Error", err);
        res.status(500).json({ message: "Internal Server Error" });
    }       
}

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error("Delete Task Error", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
