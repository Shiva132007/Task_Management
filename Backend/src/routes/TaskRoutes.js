import express from "express";
import { createTask,deleteTask,getAllTasks,getTaskById,updateTask,toggleTaskStatus } from "../controllers/taskControllers.js";
import protect from "../middleware/taskMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/taskSchemas.js";

const router=express.Router();

router.post('/tasks', protect, validate(createTaskSchema), createTask);
router.get('/tasks', protect, getAllTasks);
router.get('/tasks/:id', protect, getTaskById);
router.put('/tasks/:id', protect, validate(updateTaskSchema), updateTask);
router.delete('/tasks/:id', protect, deleteTask);
router.patch("/tasks/:id/status", protect, toggleTaskStatus);


export default router;
