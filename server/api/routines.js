import express from "express";
import { supabase } from "../lib/supabaseAdmin.js";

const router = express.Router();

router.get("/global", async (req, res) => {
  const { data, error } = await supabase.rpc(
    "get_global_routines_with_exercises"
  );

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { data, error } = await supabase.rpc('get_user_routines_with_exercises', { p_owner_id: userId });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
