import express from "express";
import { punchIn, punchOut } from "../controllers/punch.js";
import { verifyTokenMiddleware } from "../middleware/middleware.js";

const router = express.Router();

router.post("/punchIn", verifyTokenMiddleware, punchIn);
router.post("/punchOut", verifyTokenMiddleware, punchOut);

export default router;