import { verifyJwt } from "../utils/jwt.js";

export const verifyTokenMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access token missing" });
    }

    try {
        const decoded = verifyJwt(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token", error: error.message });
    }
};

export const verifyAdminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
};