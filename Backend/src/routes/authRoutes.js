import express from 'express';
import { login, register } from "../controllers/authControllers.js";
import { validate } from "../middleware/validateMiddleware.js";
import { loginSchema, registerSchema } from "../schemas/authSchemas.js";

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);

export default router;
