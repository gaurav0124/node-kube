// Load environment variables
// If dotenv_config_path is set (via npm scripts), use it, otherwise try .env.local or .env
const envFile = process.env.dotenv_config_path || 
                (process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local');
require('dotenv').config({ path: envFile });

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const SERVICE_NAME = process.env.SERVICE_NAME || 'user-service';
const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory data store (for demonstration purposes)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'user-service',
    message: 'User service is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'user-service',
    message: 'User Service API',
    endpoints: {
      'GET /health': 'Health check',
      'GET /api/users': 'Get all users',
      'GET /api/users/:id': 'Get user by ID',
      'POST /api/users': 'Create a new user',
      'POST /api/auth/login': 'User login'
    }
  });
});

// GET endpoints

// Get all users
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: users,
    count: users.length
  });
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

// POST endpoints

// Create a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  // Validation
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required'
    });
  }
  
  // Check if email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists'
    });
  }
  
  // Create new user
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

// User login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  // Find user by email (in a real app, you'd verify password hash)
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
  
  // Simulate password check (in real app, use bcrypt or similar)
  // For demo purposes, accept any password if user exists
  const token = `token_${Date.now()}_${user.id}`;
  
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token: token,
      expiresIn: JWT_EXPIRES_IN
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found in user service'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`${SERVICE_NAME} is running`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Port: ${PORT}`);
  console.log(`Log Level: ${LOG_LEVEL}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`========================================`);
  console.log(`Available endpoints:`);
  console.log(`  GET  /health`);
  console.log(`  GET  /api/users`);
  console.log(`  GET  /api/users/:id`);
  console.log(`  POST /api/users`);
  console.log(`  POST /api/auth/login`);
  console.log(`========================================`);
});

