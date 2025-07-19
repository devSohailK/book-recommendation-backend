import express from 'express';
import pool from '../database.js';
import authMiddleware from '../middleware/auth.js';
import bcrypt from 'bcrypt';

const router = express.Router();
router.use(express.json());

router.get('/profile/', authMiddleware, async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await pool.query('SELECT user_id, name, email FROM users WHERE user_id = $1', [userId]);

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user: user.rows[0] });
    } catch (err) {
        console.error('Profile fetch error:', err);
        res.status(500).json({ error: 'Server error' });
    }
})


router.put('/profile/update', authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    const { name, email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const updateUser = await pool.query(
            'UPDATE users SET name = $1, email = $2, password_hash = $3 WHERE user_id = $4 RETURNING user_id, name, email',
            [name, email, hashedPassword, userId]
        );

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updateUser.rows[0]
        });

    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


export default router;