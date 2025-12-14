import express from "express";
import { getSettings, updateSettings } from "../controllers/settings.js";
import { verifyTokenMiddleware, verifyAdminMiddleware } from "../middleware/middleware.js";

const router = express.Router();

router.get("/settings", verifyTokenMiddleware, getSettings);
router.put("/settings", verifyTokenMiddleware, verifyAdminMiddleware, updateSettings);

export default router;
