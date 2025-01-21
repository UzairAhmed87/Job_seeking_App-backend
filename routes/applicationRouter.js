import express from 'express';
import { employerGetAllApplications , jobSeekerAllApplications , jobSeekerDeleteApplication, postApplication, } from '../controllers/applicationController.js';
import { isAuthorized } from '../middlewares/auth.js';
const router = express.Router();
router.get("/employer/getAll",isAuthorized,employerGetAllApplications);
router.get("/jobseeker/getAll",isAuthorized,jobSeekerAllApplications);
router.delete("/deletejob:id",isAuthorized,jobSeekerDeleteApplication)
router.post("/postApplication",isAuthorized,postApplication)
export default router;