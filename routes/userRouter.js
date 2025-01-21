import express from 'express';
import { register,signIn,logout,getUser } from '../controllers/userController.js';
import { isAuthorized } from '../middlewares/auth.js';

const router = express.Router();
router.post("/register",register);
router.post("/signin",signIn);
router.get("/logout",isAuthorized,logout);
router.get("/getUser",isAuthorized,getUser)
export default router;