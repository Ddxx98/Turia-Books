import 'dotenv/config';
import { Sequelize } from 'sequelize';
import employeeModel from './employee.js';
import attendanceModel from './attendance.js';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
});

const Employee = employeeModel(sequelize);
const Attendance = attendanceModel(sequelize);

Employee.hasMany(Attendance, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Attendance.belongsTo(Employee, { foreignKey: 'employeeId' });

export { sequelize, Employee, Attendance };