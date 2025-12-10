import { Employee } from "../models/db.js";
import { signJwt } from "../utils/jwt.js";
import { comparePassword } from "../utils/bcrypt.js";

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const employee = await Employee.findOne({ where: { email } });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        const isPasswordValid = await comparePassword(password, employee.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const payload = { id: employee.id, email: employee.email, name: employee.name, role: employee.role };
        const token = signJwt(payload);
        res.status(200).json({ token, role: employee.role });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};