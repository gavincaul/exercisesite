import express from "express";
import { supabase, supabaseService } from "../lib/supabaseAdmin.js";

const router = express.Router();

const INVITE_CODE = process.env.INVITE_CODE || "DoogalIsTheBestMovie";

router.post("/signup", async (req, res) => {
  const { email, password, inviteCode } = req.body;

  if (inviteCode !== INVITE_CODE) {
    return res.status(403).json({ error: "Invalid invite code" });
  }

  try {
    // Create user with Supabase admin API
    const { data, error } = await supabaseService.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ user: data.user });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({  email,  password})

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Return session and user info
    res.json({ session: data.session, user: data.user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
