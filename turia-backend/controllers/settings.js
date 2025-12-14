import { query } from "../models/db.js";
import { v4 as uuidv4 } from 'uuid';

export const getSettings = async (req, res) => {
    try {
        let result = await query('SELECT * FROM "BusinessHours" LIMIT 1');
        let settings = result.rows[0];

        if (!settings) {
            const id = uuidv4();
            const now = new Date();
            const insertText = `
                INSERT INTO "BusinessHours" (id, "startTime", "endTime", "graceTime", "createdAt", "updatedAt")
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
            const newSettings = await query(insertText, [id, "09:00", "18:00", 10, now, now]);
            settings = newSettings.rows[0];
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const { startTime, endTime, graceTime } = req.body;
        let result = await query('SELECT * FROM "BusinessHours" LIMIT 1');
        let settings = result.rows[0];
        const now = new Date();

        if (!settings) {
            const id = uuidv4();
            const insertText = `
                INSERT INTO "BusinessHours" (id, "startTime", "endTime", "graceTime", "createdAt", "updatedAt")
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
            const newSettings = await query(insertText, [id, startTime, endTime, graceTime, now, now]);
            settings = newSettings.rows[0];
        } else {
            const updateText = `
                UPDATE "BusinessHours" 
                SET "startTime" = $1, "endTime" = $2, "graceTime" = $3, "updatedAt" = $4
                WHERE id = $5 
                RETURNING *;
            `;
            const updatedSettings = await query(updateText, [startTime, endTime, graceTime, now, settings.id]);
            settings = updatedSettings.rows[0];
        }

        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// import { BusinessHours } from "../models/db.js";

// export const getSettings = async (req, res) => {
//     try {
//         let settings = await BusinessHours.findOne();
//         if (!settings) {
//             settings = await BusinessHours.create({
//                 startTime: "09:00",
//                 endTime: "18:00",
//                 graceTime: 10
//             });
//         }
//         res.status(200).json(settings);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// export const updateSettings = async (req, res) => {
//     try {
//         const { startTime, endTime, graceTime } = req.body;
//         let settings = await BusinessHours.findOne();

//         if (!settings) {
//             settings = await BusinessHours.create({
//                 startTime,
//                 endTime,
//                 graceTime
//             });
//         } else {
//             settings.startTime = startTime;
//             settings.endTime = endTime;
//             settings.graceTime = graceTime;
//             await settings.save();
//         }

//         res.status(200).json(settings);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
