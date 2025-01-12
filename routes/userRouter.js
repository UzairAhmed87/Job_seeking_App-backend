import express from 'express';
import { register,signIn,logout } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();
router.post("/register",register);
router.post("/signin",signIn);
router.get("/logout",isAuthenticated,logout);
export default router;