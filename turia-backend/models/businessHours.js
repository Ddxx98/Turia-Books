// import { DataTypes } from 'sequelize';
// import { v4 as uuidv4 } from 'uuid';

// export default (sequelize) => {
//     const BusinessHours = sequelize.define('BusinessHours', {
//         id: {
//             type: DataTypes.UUID,
//             primaryKey: true,
//             defaultValue: uuidv4,
//         },
//         startTime: {
//             type: DataTypes.STRING, // Format: "HH:mm"
//             allowNull: false,
//             defaultValue: "09:00"
//         },
//         endTime: {
//             type: DataTypes.STRING, // Format: "HH:mm"
//             allowNull: false,
//             defaultValue: "18:00"
//         },
//         graceTime: {
//             type: DataTypes.INTEGER, // Minutes
//             allowNull: false,
//             defaultValue: 10
//         }
//     });

//     return BusinessHours;
// }
