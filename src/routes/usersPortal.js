const express = require('express');
const jwt = require('jsonwebtoken');
const TABLE = require('../utils/tables')
const bcrypt = require('bcryptjs');
const pool = require('../utils/db');
const router = express.Router();
const multer = require('multer');
const path = require('path');


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.API_SECRET_KEY, (err, user) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
  });
};


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/userimages/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/register', upload.fields([{ name: 'avatarurl' }]), async (req, res) => {
  const { first_name, last_name, email, mobile_number, password } = req.body;
  
  if (!email || !mobile_number || !password) {
    return res.status(400).json({ message: 'Email, Password or mobile number cannot be empty', status: 'error' });
  }

  const avatarUrl = req.files['avatarurl']
    ? `${req.protocol}://${req.get('host')}/userimages/${req.files['avatarurl'][0].filename}`
    : null;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO ${TABLE.USERS_TABLE} (first_name, last_name, avatarurl, email, mobile_number, password) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, avatarUrl, email, mobile_number, hashedPassword]
    );

    res.status(201).json({
      message: 'User created successfully',
      status: true,
      userId: result.insertId
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error', status: 'error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [result] = await pool.query(`SELECT * FROM ${TABLE.USERS_TABLE} WHERE email = ?`, [email]);
    if (result.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password', status: 'error' });
    }
    const user = result[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password', status: 'error' });
    }
    const accessToken = jwt.sign(
      { id: user.id }, 
      process.env.API_SECRET_KEY, 
      { expiresIn: process.env.API_TOKEN_EXPIRESIN }
    );
    res.status(200).json({
      accessToken,
      message: 'Login successful',
      status: true,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile_number: user.mobile_number,
        avatarurl: user.avatarurl
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', status: 'error' });
  }
});

router.get('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const query = `SELECT id, first_name, last_name, email, mobile_number, avatarurl
                   FROM ${TABLE.USERS_TABLE} 
                   WHERE id = ? AND status = 1`;

    const [result] = await pool.query(query, [userId]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found', status: 'error' });
    }
    res.status(200).json({
      data: result[0],
      message: 'User profile retrieved successfully',
      status: true,
    });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    res.status(500).json({ message: 'Server error', status: 'error' });
  }
});


router.put('/profile', authenticateToken, upload.single('avatarurl'), async (req, res) => {
  const userId = req.user.id;
  const { first_name, last_name, mobile_number } = req.body;
  const avatarurl = req.file ? `${req.protocol}://${req.get('host')}/userimages/${req.file.filename}` : req.body.avatarurl;

  try {
    const [user] = await pool.query(`SELECT avatarurl FROM ${TABLE.USERS_TABLE} WHERE id = ?`, [userId]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found', status: 'error' });
    }


    const fields = [first_name, last_name, mobile_number, avatarurl].filter(val => val !== undefined);
    const setClause = [
      first_name !== undefined ? 'first_name = ?' : null,
      last_name !== undefined ? 'last_name = ?' : null,
      mobile_number !== undefined ? 'mobile_number = ?' : null,
      avatarurl !== undefined ? 'avatarurl = ?' : null
    ].filter(Boolean).join(', ');

    if (!setClause) {
      return res.status(400).json({ message: 'No fields to update', status: 'error' });
    }

    fields.push(userId);


    console.log('Updating with query:', `UPDATE ${TABLE.USERS_TABLE} SET ${setClause} WHERE id = ?`);
    console.log('With parameters:', fields);

    const [result] = await pool.query(`UPDATE ${TABLE.USERS_TABLE} SET ${setClause} WHERE id = ?`, fields);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found', status: 'error' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      status: true
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', status: 'error' });
  }
});

module.exports = router;