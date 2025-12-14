import { query } from "../models/db.js";

export const getAttendance = async (req, res) => {
    try {
        const { date, name, status } = req.query;
        let text = `
            SELECT a.*, e.name as "employeeName", e.email as "employeeEmail"
            FROM "Attendances" a
            JOIN "Employees" e ON a."employeeId" = e.id
            WHERE 1=1
        `;
        const values = [];
        let paramIndex = 1;

        if (date) {
            text += ` AND a.date = $${paramIndex}`;
            values.push(date);
            paramIndex++;
        }

        if (status) {
            text += ` AND a.status = $${paramIndex}`;
            values.push(status);
            paramIndex++;
        }

        if (name) {
            text += ` AND e.name ILIKE $${paramIndex}`;
            values.push(`%${name}%`);
            paramIndex++;
        }

        text += ` ORDER BY a.date DESC`;

        const result = await query(text, values);

        // Transform result to match previous structure if needed, or update frontend
        // For now, let's map it to include Employee object to match Sequelize structure
        const attendance = result.rows.map(row => ({
            ...row,
            Employee: {
                name: row.employeeName,
                email: row.employeeEmail
            }
        }));

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const totalEmployeesRes = await query(`SELECT COUNT(*) FROM "Employees" WHERE role = 'employee'`);
        const totalEmployees = parseInt(totalEmployeesRes.rows[0].count);

        const presentTodayRes = await query(`SELECT COUNT(*) FROM "Attendances" WHERE date = $1`, [today]);
        const presentToday = parseInt(presentTodayRes.rows[0].count);

        const onTimeTodayRes = await query(`SELECT COUNT(*) FROM "Attendances" WHERE date = $1 AND status = 'on-time'`, [today]);
        const onTimeToday = parseInt(onTimeTodayRes.rows[0].count);

        const lateTodayRes = await query(`SELECT COUNT(*) FROM "Attendances" WHERE date = $1 AND status = 'late'`, [today]);
        const lateToday = parseInt(lateTodayRes.rows[0].count);

        const attendanceRate = totalEmployees > 0 ? ((presentToday / totalEmployees) * 100).toFixed(1) : 0;

        res.status(200).json({
            totalEmployees,
            presentToday,
            onTimeToday,
            lateToday,
            attendanceRate
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// import { Attendance, Employee } from "../models/db.js";
// import { Op } from "sequelize";

// export const getAttendance = async (req, res) => {
//     try {
//         const { date, name, status } = req.query;
//         const whereClause = {};
//         const employeeWhere = {};

//         if (date) {
//             const startOfDay = new Date(date);
//             startOfDay.setHours(0, 0, 0, 0);
//             const endOfDay = new Date(date);
//             endOfDay.setHours(23, 59, 59, 999);

//             whereClause.date = {
//                 [Op.between]: [startOfDay, endOfDay]
//             };
//         }

//         if (status) {
//             whereClause.status = status;
//         }

//         if (name) {
//             employeeWhere.name = {
//                 [Op.iLike]: `%${name}%`
//             };
//         }

//         const attendance = await Attendance.findAll({
//             where: whereClause,
//             include: [{
//                 model: Employee,
//                 where: employeeWhere,
//                 attributes: ['id', 'name', 'email']
//             }],
//             order: [['date', 'DESC']]
//         });

//         res.status(200).json(attendance);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// export const getAnalytics = async (req, res) => {
//     try {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const tomorrow = new Date(today);
//         tomorrow.setDate(tomorrow.getDate() + 1);

//         const totalEmployees = await Employee.count({
//             where: {
//                 role: 'employee'
//             }
//         });

//         const presentToday = await Attendance.count({
//             where: {
//                 date: {
//                     [Op.gte]: today,
//                     [Op.lt]: tomorrow
//                 }
//             }
//         });

//         const onTimeToday = await Attendance.count({
//             where: {
//                 date: {
//                     [Op.gte]: today,
//                     [Op.lt]: tomorrow
//                 },
//                 status: 'on-time'
//             }
//         });

//         const lateToday = await Attendance.count({
//             where: {
//                 date: {
//                     [Op.gte]: today,
//                     [Op.lt]: tomorrow
//                 },
//                 status: 'late'
//             }
//         });

//         const attendanceRate = totalEmployees > 0 ? ((presentToday / totalEmployees) * 100).toFixed(1) : 0;

//         res.status(200).json({
//             totalEmployees,
//             presentToday,
//             onTimeToday,
//             lateToday,
//             attendanceRate
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
