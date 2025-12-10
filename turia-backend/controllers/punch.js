import { Employee, Attendance } from "../models/db.js";
import { Op, Sequelize } from 'sequelize';

export const punchIn = async (req, res, next) => {
    const { id: employeeId } = req.user;
    const { date, punchInTime } = req.body;
    try {
        const employee = await Employee.findByPk(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        const existingRecord = await Attendance.findOne({ where: { employeeId, date } });
        if (existingRecord) {
            return res.status(400).json({ message: "Already punched in for today" });
        }

        let status = "";
        const punchTime = new Date(punchInTime);
        const hours = punchTime.getHours();
        const minutes = punchTime.getMinutes();
        const totalMinutes = hours * 60 + minutes;
        const businessStartMinutes = 9 * 60;
        const graceEndMinutes = 9 * 60 + 10;

        if (totalMinutes < businessStartMinutes) {
            status = "early";
        } else if (totalMinutes <= graceEndMinutes) {
            status = "on-time";
        } else {
            status = "late";
        }

        const attendance = await Attendance.create({ employeeId, date, punchInTime, status });
        console.log('Punch In created:', { employeeId, date, punchInTime, status });
        res.status(201).json({ attendance });
    } catch (error) {
        console.error('PunchIn error:', error);
        res.status(400).json({ error: error.message });
    }
};

export const punchOut = async (req, res, next) => {
    const { id: employeeId } = req.user;
    const { date, punchOutTime } = req.body;
    try {
        const employee = await Employee.findByPk(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const attendance = await Attendance.findOne({
            where: {
                employeeId,
                [Op.and]: [
                    Sequelize.where(
                        Sequelize.fn('DATE', Sequelize.col('date')),
                        date
                    )
                ]
            },
            order: [['createdAt', 'DESC']]
        });

        if (!attendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        attendance.punchOutTime = punchOutTime;

        const start = new Date(attendance.punchInTime);
        const end = new Date(punchOutTime);
        const diffMs = end - start;
        const diffHrs = diffMs / (1000 * 60 * 60);

        // console.log('=== Total Hours Calculation ===');
        // console.log('Punch In Time (from DB):', attendance.punchInTime);
        // console.log('Punch Out Time (from request):', punchOutTime);
        // console.log('Start Date object:', start.toISOString());
        // console.log('End Date object:', end.toISOString());
        // console.log('Difference in milliseconds:', diffMs);
        // console.log('Difference in hours:', diffHrs);
        // console.log('Total hours (rounded):', parseFloat(diffHrs.toFixed(2)));
        // console.log('===============================');

        attendance.totalHours = parseFloat(diffHrs.toFixed(2));

        await attendance.save();
        res.status(200).json({ attendance });
    } catch (error) {
        console.error('PunchOut error:', error);
        res.status(400).json({ error: error.message });
    }
};