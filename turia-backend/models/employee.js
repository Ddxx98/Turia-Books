// import { DataTypes } from 'sequelize';
// import { v4 as uuidv4 } from 'uuid';

// export default (sequelize) => {
//     const Employee = sequelize.define('Employee', {
//         id: {
//             type: DataTypes.UUID,
//             primaryKey: true,
//             defaultValue: uuidv4,
//         },
//         email: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true,
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         password: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         role: {
//             type: DataTypes.ENUM('employee', 'admin'),
//             defaultValue: 'employee',
//             allowNull: false,
//         },
//     });

//     return Employee;
// }