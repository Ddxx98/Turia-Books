import { hashPassword } from "../utils/bcrypt.js";
import { Employee } from "../models/db.js";

export const register = async (req, res, next) => {
    const { email, name, password, role } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        const employee = await Employee.create({ email, name, password: hashedPassword, role });
        res.status(201).json({ employee });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};