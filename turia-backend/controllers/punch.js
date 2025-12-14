import { query } from "../models/db.js";
import { v4 as uuidv4 } from 'uuid';

export const punchIn = async (req, res, next) => {
    const { id: employeeId } = req.user;
    const { date, punchInTime } = req.body;
    try {
        // Check if employee exists
        const empRes = await query('SELECT * FROM "Employees" WHERE id = $1', [employeeId]);
        if (empRes.rows.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Check existing punch
        const attRes = await query('SELECT * FROM "Attendances" WHERE "employeeId" = $1 AND date = $2', [employeeId, date]);
        if (attRes.rows.length > 0) {
            return res.status(400).json({ message: "Already punched in for today" });
        }

        // Fetch business hours settings
        let settingsRes = await query('SELECT * FROM "BusinessHours" LIMIT 1');
        let settings = settingsRes.rows[0];
        if (!settings) {
            settings = { startTime: "09:00", graceTime: 10 }; // Defaults
        }

        const [startHour, startMinute] = settings.startTime.split(':').map(Number);
        const businessStartMinutes = startHour * 60 + startMinute;
        const graceEndMinutes = businessStartMinutes + settings.graceTime;

        let status = "";
        const punchTime = new Date(punchInTime);
        const hours = punchTime.getHours();
        const minutes = punchTime.getMinutes();
        const totalMinutes = hours * 60 + minutes;

        if (totalMinutes < businessStartMinutes) {
            status = "early";
        } else if (totalMinutes <= graceEndMinutes) {
            status = "on-time";
        } else {
            status = "late";
        }

        const id = uuidv4();
        const now = new Date();
        const insertText = `
            INSERT INTO "Attendances" (id, "employeeId", date, "punchInTime", status, "createdAt", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const newAtt = await query(insertText, [id, employeeId, date, punchInTime, status, now, now]);
        console.log('Punch In created:', newAtt.rows[0]);
        res.status(201).json({ attendance: newAtt.rows[0] });
    } catch (error) {
        console.error('PunchIn error:', error);
        res.status(400).json({ error: error.message });
    }
};

export const punchOut = async (req, res, next) => {
    const { id: employeeId } = req.user;
    const { date, punchOutTime } = req.body;
    try {
        const empRes = await query('SELECT * FROM "Employees" WHERE id = $1', [employeeId]);
        if (empRes.rows.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const attRes = await query(`
            SELECT * FROM "Attendances" 
            WHERE "employeeId" = $1 AND date = $2 
            ORDER BY "createdAt" DESC LIMIT 1
        `, [employeeId, date]);

        if (attRes.rows.length === 0) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        const attendance = attRes.rows[0];

        if (attendance.punchOutTime) {
            return res.status(400).json({ message: "Already punched out for today" });
        }

        const start = new Date(attendance.punchInTime);
        const end = new Date(punchOutTime);
        const diffMs = end - start;
        const diffHrs = diffMs / (1000 * 60 * 60);
        const totalHours = parseFloat(diffHrs.toFixed(2));
        const now = new Date();

        const updateText = `
            UPDATE "Attendances" 
            SET "punchOutTime" = $1, "totalHours" = $2, "updatedAt" = $3 
            WHERE id = $4 
            RETURNING *;
        `;
        const updatedAtt = await query(updateText, [punchOutTime, totalHours, now, attendance.id]);

        res.status(200).json({ attendance: updatedAtt.rows[0] });
    } catch (error) {
        console.error('PunchOut error:', error);
        res.status(400).json({ error: error.message });
    }
};

// import { Employee, Attendance, BusinessHours } from "../models/db.js";
// import { Op, Sequelize } from 'sequelize';

// export const punchIn = async (req, res, next) => {
//     const { id: employeeId } = req.user;
//     const { date, punchInTime } = req.body;
//     try {
//         const employee = await Employee.findByPk(employeeId);
//         if (!employee) {
//             return res.status(404).json({ message: "Employee not found" });
//         }
//         const existingRecord = await Attendance.findOne({ where: { employeeId, date } });
//         if (existingRecord) {
//             return res.status(400).json({ message: "Already punched in for today" });
//         }

//         // Fetch business hours settings
//         let settings = await BusinessHours.findOne();
//         if (!settings) {
//             settings = { startTime: "09:00", graceTime: 10 }; // Defaults
//         }

//         const [startHour, startMinute] = settings.startTime.split(':').map(Number);
//         const businessStartMinutes = startHour * 60 + startMinute;
//         const graceEndMinutes = businessStartMinutes + settings.graceTime;

//         let status = "";
//         const punchTime = new Date(punchInTime);
//         const hours = punchTime.getHours();
//         const minutes = punchTime.getMinutes();
//         const totalMinutes = hours * 60 + minutes;

//         if (totalMinutes < businessStartMinutes) {
//             status = "early";
//         } else if (totalMinutes <= graceEndMinutes) {
//             status = "on-time";
//         } else {
//             status = "late";
//         }

//         const attendance = await Attendance.create({ employeeId, date, punchInTime, status });
//         console.log('Punch In created:', { employeeId, date, punchInTime, status });
//         res.status(201).json({ attendance });
//     } catch (error) {
//         console.error('PunchIn error:', error);
//         res.status(400).json({ error: error.message });
//     }
// };

// export const punchOut = async (req, res, next) => {
//     const { id: employeeId } = req.user;
//     const { date, punchOutTime } = req.body;
//     try {
//         const employee = await Employee.findByPk(employeeId);
//         if (!employee) {
//             return res.status(404).json({ message: "Employee not found" });
//         }

//         const attendance = await Attendance.findOne({
//             where: {
//                 employeeId,
//                 [Op.and]: [
//                     Sequelize.where(
//                         Sequelize.fn('DATE', Sequelize.col('date')),
//                         date
//                     )
//                 ]
//             },
//             order: [['createdAt', 'DESC']]
//         });

//         if (!attendance) {
//             return res.status(404).json({ message: "Attendance record not found" });
//         }

//         attendance.punchOutTime = punchOutTime;

//         const start = new Date(attendance.punchInTime);
//         const end = new Date(punchOutTime);
//         const diffMs = end - start;
//         const diffHrs = diffMs / (1000 * 60 * 60);

//         attendance.totalHours = parseFloat(diffHrs.toFixed(2));

//         await attendance.save();
//         res.status(200).json({ attendance });
//     } catch (error) {
//         console.error('PunchOut error:', error);
//         res.status(400).json({ error: error.message });
//     }
// };