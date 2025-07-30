import express from "express";
import { supabase } from "../lib/supabaseAdmin.js";

const router = express.Router();

router.get("/", async (req, res) => {

    const { data, error } = await supabase.rpc("get_movements_with_muscles");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
