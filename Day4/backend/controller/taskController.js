import TODO from "../models/taskModel.js";

export const getTODOs = async (req, res) => {
    try{
        const todo = await TODO.find();
        return res.status(200).json({
            success:true,
            message: "Todos fetched successfully",
            data: todo,
        });
    }catch(err){
        console.error("Get Todo Error", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export const createTODO = async (req, res) => {
    try{
        const {text} = req.body;
        const todo = await TODO.create({ text });
        return res.status(201).json({
            message: "Todo created Successfully",
            data: todo,
        })
    }catch(err){
        res.status(500).json({
            message: "Error in creating Todo", err})
    }
}

export const updateTODO = async (req, res) => {
    try{
        const { text, completed } = req.body;
        const { id } = req.params;
        const todo = await TODO.findByIdAndUpdate(id, { text, completed }, { new: true });
        res.status(201).json({
            success: true,
            message: "Todo Updated successfully", 
            data: todo,
            })
    }catch(err) {
        console.error("Error in Updating TODO", err);
        res.status(500).json({
            success:false,
            message: "Error in Updating", err
        })
    }
}

export const deleteTODO = async (req, res) => {
    try{
        const { id } = req.params;
        const todo = await TODO.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Todo deleted successfully",
            data: todo
        });
    }catch(err){
        console.error("Error in deleting task", err);
        res.status(500).json({
            success: false,
            message: "Task not found", err
        });
    }

}