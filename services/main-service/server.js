// Load environment variables
// If dotenv_config_path is set (via npm scripts), use it, otherwise try .env.local or .env
const envFile = process.env.dotenv_config_path || 
                (process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local');
require('dotenv').config({ path: envFile });

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const SERVICE_NAME = process.env.SERVICE_NAME || 'main-service';
const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory data store (for demonstration purposes)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

let products = [];
let orders = [];
let comments = [];

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: SERVICE_NAME,
    message: 'Server is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Node Express API',
    endpoints: {
      'GET /': 'API information',
      'GET /health': 'Health check',
      'GET /api/users': 'Get all users',
      'GET /api/users/:id': 'Get user by ID',
      'POST /api/users': 'Create a new user',
      'POST /api/messages': 'Create a new message',
      'POST /api/products': 'Create a new product',
      'POST /api/orders': 'Create a new order',
      'POST /api/auth/login': 'User login',
      'POST /api/comments': 'Create a new comment'
    }
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

// Create a new message
app.post('/api/messages', (req, res) => {
  const { title, content, author } = req.body;
  
  // Validation
  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: 'Title and content are required'
    });
  }
  
  const message = {
    id: Date.now(),
    title,
    content,
    author: author || 'Anonymous',
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    message: 'Message created successfully',
    data: message
  });
});

// Create a new product
app.post('/api/products', (req, res) => {
  const { name, price, description, category } = req.body;
  
  // Validation
  if (!name || !price) {
    return res.status(400).json({
      success: false,
      message: 'Name and price are required'
    });
  }
  
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Price must be a positive number'
    });
  }
  
  const product = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    price,
    description: description || '',
    category: category || 'General',
    createdAt: new Date().toISOString()
  };
  
  products.push(product);
  
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

// Create a new order
app.post('/api/orders', (req, res) => {
  const { userId, items, shippingAddress } = req.body;
  
  // Validation
  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'UserId and items array are required'
    });
  }
  
  // Validate items structure
  const invalidItems = items.some(item => !item.productId || !item.quantity || item.quantity <= 0);
  if (invalidItems) {
    return res.status(400).json({
      success: false,
      message: 'Each item must have productId and a positive quantity'
    });
  }
  
  // Calculate total
  const total = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  
  const order = {
    id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
    userId,
    items,
    total: parseFloat(total.toFixed(2)),
    shippingAddress: shippingAddress || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  orders.push(order);
  
  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
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
      expiresIn: '24h'
    }
  });
});

// Create a new comment
app.post('/api/comments', (req, res) => {
  const { postId, userId, content } = req.body;
  
  // Validation
  if (!postId || !content) {
    return res.status(400).json({
      success: false,
      message: 'PostId and content are required'
    });
  }
  
  if (content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Content cannot be empty'
    });
  }
  
  const comment = {
    id: comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1,
    postId,
    userId: userId || null,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  comments.push(comment);
  
  res.status(201).json({
    success: true,
    message: 'Comment created successfully',
    data: comment
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
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
  console.log(`  GET  /`);
  console.log(`  GET  /health`);
  console.log(`  GET  /api/users`);
  console.log(`  GET  /api/users/:id`);
  console.log(`  POST /api/users`);
  console.log(`  POST /api/messages`);
  console.log(`  POST /api/products`);
  console.log(`  POST /api/orders`);
  console.log(`  POST /api/auth/login`);
  console.log(`  POST /api/comments`);
  console.log(`========================================`);
});

