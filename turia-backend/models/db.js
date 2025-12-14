import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const query = (text, params) => pool.query(text, params);

export const createTables = async () => {
    const createEmployeesTable = `
        CREATE TABLE IF NOT EXISTS "Employees" (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'employee' NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createAttendanceTable = `
        CREATE TABLE IF NOT EXISTS "Attendances" (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "employeeId" UUID REFERENCES "Employees"(id) ON DELETE CASCADE,
            date DATE NOT NULL,
            "punchInTime" TIMESTAMP WITH TIME ZONE,
            "punchOutTime" TIMESTAMP WITH TIME ZONE,
            "totalHours" FLOAT,
            status VARCHAR(50) NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createBusinessHoursTable = `
        CREATE TABLE IF NOT EXISTS "BusinessHours" (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "startTime" VARCHAR(10) NOT NULL DEFAULT '09:00',
            "endTime" VARCHAR(10) NOT NULL DEFAULT '18:00',
            "graceTime" INTEGER NOT NULL DEFAULT 10,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(createEmployeesTable);
        await pool.query(createAttendanceTable);
        await pool.query(createBusinessHoursTable);
        console.log("Tables created successfully");
    } catch (err) {
        console.error("Error creating tables", err);
    }
};

// import 'dotenv/config';
// import { Sequelize } from 'sequelize';
// import employeeModel from './employee.js';
// import attendanceModel from './attendance.js';
// import businessHoursModel from './businessHours.js';

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//     dialect: 'postgres',
//     logging: false,
// });

// const Employee = employeeModel(sequelize);
// const Attendance = attendanceModel(sequelize);
// const BusinessHours = businessHoursModel(sequelize);

// Employee.hasMany(Attendance, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
// Attendance.belongsTo(Employee, { foreignKey: 'employeeId' });

// export { sequelize, Employee, Attendance, BusinessHours };