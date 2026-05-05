const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'hotelbookingsecret';
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(cors());
app.use(express.json());

const readUsers = async () => {
  try {
    const content = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (error) {
    return [];
  }
};

const writeUsers = async (users) => {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
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

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const users = await readUsers();
  const existingEmail = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existingEmail) {
    return res.status(409).json({ message: 'Email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    username,
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsers(users);

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

  const users = await readUsers();
  const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
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
  const users = await readUsers();
  const user = users.find((item) => item.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  return res.json({ id: user.id, username: user.username, email: user.email });
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
