import express from "express";
import { getAttendance, getAnalytics } from "../controllers/attendance.js";
import { verifyTokenMiddleware, verifyAdminMiddleware } from "../middleware/middleware.js";

const router = express.Router();

router.get("/attendance", verifyTokenMiddleware, verifyAdminMiddleware, getAttendance);
router.get("/analytics", verifyTokenMiddleware, verifyAdminMiddleware, getAnalytics);

export default router;
