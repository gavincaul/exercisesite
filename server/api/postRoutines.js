import express from "express";
import { supabase } from "../lib/supabaseAdmin.js";

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { routine, exerciseList } = req.body;


    // Insert routine first
    const { data: routineData, error: routineError } = await supabase
      .from("routines")
      .insert(routine)
      .select("id")
      .single();

    if (routineError) {
      return res.status(500).json({ error: routineError.message });
    }

    const { data: exerciseData, error: exerciseError } = await supabase
      .from("exercise")
      .insert(exerciseList)
      .select();

    if (exerciseError) {
      return res.status(500).json({ error: exerciseError.message });
    }
    res.status(201).json({ routine: routineData, exercises: exerciseData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;


