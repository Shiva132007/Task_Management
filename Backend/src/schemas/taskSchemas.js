import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(120, "Title must be under 120 characters"),
    description: z.string().max(2000, "Description is too long").optional(),
    status: z.enum(["pending", "completed"]).optional(), // The existing frontend uses 'pending' instead of 'todo' and 'in-progress' based on Dashboard.jsx filter
    priority: z.enum(["low", "medium", "high"]).optional(),
    dueDate: z.string().optional().refine(date => !date || !isNaN(Date.parse(date)), {
      message: "Invalid date format"
    })
  })
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(120, "Title must be under 120 characters").optional(),
    description: z.string().max(2000, "Description is too long").optional(),
    status: z.enum(["pending", "completed"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    dueDate: z.string().optional().refine(date => !date || !isNaN(Date.parse(date)), {
      message: "Invalid date format"
    })
  })
});
