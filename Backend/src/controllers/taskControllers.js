import Task from "../models/taskModel.js";

const createTask = async (req, res) => {
    const { title, description = '', status = 'pending', priority = 'medium', dueDate } = req.body;

    try {
        const task = await Task.create({
            userId: req.user.id,
            title,
            description,
            status,
            priority,
            dueDate: dueDate ? new Date(dueDate) : undefined,
        });

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            task,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllTasks = async (req, res) => {
    try{
        const tasks=await Task.find({userId:req.user.id});
        res.status(200).json({
            success:true,
            tasks,
            message:'Tasks retrieved successfully'
        })
    }
    catch(error){
        res.status(400).json({
            message:error.message,
            success:false
        })
    }
}

const getTaskById=async(req,res)=>{
    const{id}=req.params;
    try{
        const task=await Task.findOne({_id:id,userId:req.user.id});
        if(!task){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }
        res.status(200).json({
            success:true,
            message:"Task retrieved successfully",
            task
        })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:"Error retrieving task"
        })
    }
}

const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    try {
        const updatedFields = {};

        if (title !== undefined) updatedFields.title = title;
        if (description !== undefined) updatedFields.description = description;
        if (status !== undefined) updatedFields.status = status;
        if (priority !== undefined) updatedFields.priority = priority;
        if (dueDate !== undefined) updatedFields.dueDate = dueDate ? new Date(dueDate) : null;

        const task = await Task.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            updatedFields,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
                success: false,
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            task,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating task',
        });
    }
};

const deleteTask=async(req,res)=>{
    const{id}=req.params;
    try{
        const task=await Task.findOneAndDelete({_id:id,userId:req.user.id});
        if(!task){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }
        res.status(200).json({
            success:true,
            message:"Task deleted successfully",
            task
        })
    }
    catch(error){
        res.status(404).json({
            success:false,
            message:"Error deleting task"
        })
    }
}

const toggleTaskStatus=async(req,res)=>{
    const{id}=req.params;
    try{
        const task=await Task.findOne({_id:id,userId:req.user.id});
        if(!task){
            return res.status(404).json({
                success:false,
                message:"Task not found"
            })
        }
        task.status=task.status==="pending"?"completed":"pending";
        await task.save();
        res.status(200).json({
            success:true,
            message:"Task status toggled successfully",
            task
        })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:"Error toggling task status"
        })
    }
}

export {createTask,getAllTasks,getTaskById,updateTask,deleteTask,toggleTaskStatus};
