import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createTables } from './models/db.js';

import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
import punchRoute from "./routes/punch.js";
import attendanceRoute from "./routes/attendance.js";
import settingsRoute from "./routes/settings.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use('/api', punchRoute);
app.use('/api', attendanceRoute);
app.use('/api', settingsRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong.' });
});

const startServer = async () => {
  try {
    await createTables();
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { sequelize } from './models/db.js';

// import registerRoute from "./routes/register.js";
// import loginRoute from "./routes/login.js";
// import punchRoute from "./routes/punch.js";
// import attendanceRoute from "./routes/attendance.js";
// import settingsRoute from "./routes/settings.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// app.use("/api", registerRoute);
// app.use("/api", loginRoute);
// app.use('/api', punchRoute);
// app.use('/api', attendanceRoute);
// app.use('/api', settingsRoute);

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Something went wrong.' });
// });

// const startServer = async () => {
//   try {
//     const result = await sequelize.sync({ alter: true });
//     console.log("Database synchronized");
//     app.listen(PORT, () => {
//       console.log(`Server started on port ${PORT}`);
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

// startServer();