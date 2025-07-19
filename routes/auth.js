import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../database.js';

const router = express.Router();

router.use(express.json());

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;


  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, name, email',
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.rows[0],
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
