const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'hotelbookingsecret';
const DB_FILE = path.join(__dirname, 'hotel.db');
const USERS_FILE = path.join(__dirname, 'users.json');
const db = new sqlite3.Database(DB_FILE);

// Email configuration
const GMAIL_EMAIL = process.env.GMAIL_EMAIL || 'your-email@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || 'hqny ktfc cpub hasp';

// Email transporter configuration with Google App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_EMAIL,
    pass: GMAIL_APP_PASSWORD,
  },
});

app.use(cors());
app.use(express.json());

const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function runCallback(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve(this);
    });
  });
};

const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row);
    });
  });
};

const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });
};

const migrateJsonUsers = async () => {
  let users = [];
  try {
    const content = await fs.readFile(USERS_FILE, 'utf-8');
    users = JSON.parse(content || '[]');
  } catch (error) {
    return;
  }

  if (!Array.isArray(users) || users.length === 0) return;

  const existingUsers = await allQuery('SELECT email FROM users');
  const existingEmails = new Set(existingUsers.map(user => user.email));

  for (const user of users) {
    if (!user.email || !user.passwordHash || existingEmails.has(user.email.toLowerCase())) {
      continue;
    }

    await runQuery(
      'INSERT INTO users (id, username, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)',
      [
        user.id || Date.now().toString(),
        user.username || 'Guest',
        user.email.toLowerCase(),
        user.passwordHash,
        user.createdAt || new Date().toISOString(),
      ]
    );
  }
};

const initDatabase = async () => {
  await runQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
  await migrateJsonUsers();
};

const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET_KEY, {
    expiresIn: '4h',
  });
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Function to send welcome email
const sendWelcomeEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: GMAIL_EMAIL,
      to: email,
      subject: '🎉 Welcome to LuxeStay Hotel!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">🏨 LuxeStay Hotel</h1>
            <p style="margin: 10px 0 0 0;">Luxury Hotel Booking</p>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee; border-top: none;">
            <h2 style="color: #333;">Your Account Successfully Registered!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Dear <strong>${username}</strong>,
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for registering with LuxeStay Hotel! Your account has been successfully created and is ready to use.
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              You can now:
            </p>
            <ul style="color: #666; font-size: 16px; line-height: 1.8;">
              <li>Browse our luxury hotels and rooms</li>
              <li>Make bookings with ease</li>
              <li>Manage your profile</li>
              <li>View booking history</li>
            </ul>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              If you have any questions or need assistance, feel free to contact our support team.
            </p>
            <div style="margin-top: 30px; text-align: center;">
              <a href="http://localhost:3000" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Start Booking Now
              </a>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
              © 2026 LuxeStay Hotel. All rights reserved.<br>
              This is an automated email. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const normalizedEmail = email.toLowerCase();
  const existingEmail = await getQuery('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
  if (existingEmail) {
    return res.status(409).json({ message: 'Email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    username,
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  await runQuery(
    'INSERT INTO users (id, username, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)',
    [newUser.id, newUser.username, newUser.email, newUser.passwordHash, newUser.createdAt]
  );

  // Send welcome email
  await sendWelcomeEmail(newUser.email, newUser.username);

  const token = generateToken(newUser);
  return res.status(201).json({
    user: { id: newUser.id, username: newUser.username, email: newUser.email },
    token,
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const existingUser = await getQuery(
    'SELECT id, username, email, password_hash AS passwordHash FROM users WHERE email = ?',
    [email.toLowerCase()]
  );
  if (!existingUser) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = generateToken(existingUser);
  return res.json({
    user: { id: existingUser.id, username: existingUser.username, email: existingUser.email },
    token,
  });
});

app.get('/api/auth/profile', authMiddleware, async (req, res) => {
  const user = await getQuery('SELECT id, username, email FROM users WHERE id = ?', [req.user.id]);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  return res.json({ id: user.id, username: user.username, email: user.email });
});

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Auth server running on http://localhost:${PORT}`);
      console.log(`SQLite database ready at ${DB_FILE}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
