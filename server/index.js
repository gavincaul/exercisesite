import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import movementRoutes from "./api/movement.js";
import muscleRoutes from "./api/muscles.js";
import routineRoutes from "./api/routines.js";
import routineIDRoutes from "./api/routineNum.js";
import postRoutineRoutes from "./api/postRoutines.js";
import authRoutes from "./api/auth.js";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/movement", movementRoutes);
app.use("/api/muscles", muscleRoutes);
app.use("/api/routine", routineRoutes);
app.use("/api/routineIDs", routineIDRoutes);
app.use("/api/postRoutines", postRoutineRoutes);
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
