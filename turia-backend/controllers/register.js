import { hashPassword } from "../utils/bcrypt.js";
import { query } from "../models/db.js";
import { v4 as uuidv4 } from 'uuid';

export const register = async (req, res, next) => {
    const { email, name, password, role } = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        const id = uuidv4();
        const now = new Date();
        const text = `
            INSERT INTO "Employees" (id, email, name, password, role, "createdAt", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [id, email, name, hashedPassword, role || 'employee', now, now];
        const result = await query(text, values);
        res.status(201).json({ employee: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') { // Unique violation
            return res.status(400).json({ error: "Email already exists" });
        }
        res.status(400).json({ error: error.message });
    }
};

// import { hashPassword } from "../utils/bcrypt.js";
// import { Employee } from "../models/db.js";

// export const register = async (req, res, next) => {
//     const { email, name, password, role } = req.body;
//     try {
//         const hashedPassword = await hashPassword(password);
//         const employee = await Employee.create({ email, name, password: hashedPassword, role });
//         res.status(201).json({ employee });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };