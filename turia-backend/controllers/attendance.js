import { Attendance, Employee } from "../models/db.js";
import { Op } from "sequelize";

export const getAttendance = async (req, res) => {
    try {
        const { date, name, status } = req.query;
        const whereClause = {};
        const employeeWhere = {};

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            whereClause.date = {
                [Op.between]: [startOfDay, endOfDay]
            };
        }

        if (status) {
            whereClause.status = status;
        }

        if (name) {
            employeeWhere.name = {
                [Op.iLike]: `%${name}%`
            };
        }

        const attendance = await Attendance.findAll({
            where: whereClause,
            include: [{
                model: Employee,
                where: employeeWhere,
                attributes: ['id', 'name', 'email']
            }],
            order: [['date', 'DESC']]
        });

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const totalEmployees = await Employee.count({
            where: {
                role: 'employee'
            }
        });

        const presentToday = await Attendance.count({
            where: {
                date: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                }
            }
        });

        const onTimeToday = await Attendance.count({
            where: {
                date: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                },
                status: 'on-time'
            }
        });

        const lateToday = await Attendance.count({
            where: {
                date: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                },
                status: 'late'
            }
        });

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
