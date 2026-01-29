# Node.js Microservices with Nginx Gateway

This project demonstrates a microservices architecture with Node.js Express services and an Nginx reverse proxy acting as an API gateway.

## Architecture

- **Main Service** (Port 3000): Complete monolithic application with all endpoints
- **User Service** (Port 3001): Handles user management and authentication
- **Product Service** (Port 3002): Handles products, orders, messages, and comments
- **Nginx Gateway** (Port 80): Routes requests to appropriate microservices

## Services

### Main Service
A complete monolithic application with all endpoints:
- `GET /` - API information
- `GET /health` - Health check
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `POST /api/auth/login` - User login
- `POST /api/products` - Create a new product
- `POST /api/orders` - Create a new order
- `POST /api/messages` - Create a new message
- `POST /api/comments` - Create a new comment

### User Service
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `POST /api/auth/login` - User login

### Product Service
- `POST /api/products` - Create a new product
- `POST /api/orders` - Create a new order
- `POST /api/messages` - Create a new message
- `POST /api/comments` - Create a new comment

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)

## Environment Setup

### Initial Setup

1. **Set up environment files:**
   ```bash
   ./scripts/setup-env.sh
   ```
   This script copies example environment files to actual `.env.local` and `.env.production` files for all services.

2. **Check environment configuration:**
   ```bash
   ./scripts/check-env.sh
   ```
   This script verifies that all environment files are properly configured.

### Environment Files

Each service has two environment files:
- `.env.local` - For local development
- `.env.production` - For production deployment

Example files are provided as `env.local.example` and `env.production.example` in each service directory.

### Environment Variables

Common variables across all services:
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Service port number
- `SERVICE_NAME` - Name of the service
- `LOG_LEVEL` - Logging level (debug/info/warn/error)
- `API_PREFIX` - API route prefix
- `CORS_ORIGIN` - Allowed CORS origins
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS` - Maximum requests per window
- `REQUEST_TIMEOUT` - Request timeout in milliseconds

Service-specific variables:
- **User Service**: `JWT_SECRET`, `JWT_EXPIRES_IN`
- **Product Service**: `USER_SERVICE_URL`

## Quick Start with Docker

### Production Mode

1. **Set up environment files first:**
   ```bash
   ./scripts/setup-env.sh
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```
   This uses production environment files (`.env.production`).

3. **Check service status:**
   ```bash
   docker-compose ps
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f
   ```

5. **Stop all services:**
   ```bash
   docker-compose down
   ```

### Local Development Mode with Docker

To run Docker containers with local environment:
```bash
docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d
```
This uses local environment files (`.env.local`) for all services.

## Local Development

### Running Services Individually

**Main Service:**
```bash
cd services/main-service
npm install
npm run start:local    # Uses .env.local
# or
npm run dev            # Development mode with nodemon
# Service runs on http://localhost:3000
```

**User Service:**
```bash
cd services/user-service
npm install
npm run start:local    # Uses .env.local
# or
npm run dev            # Development mode with nodemon
# Service runs on http://localhost:3001
```

**Product Service:**
```bash
cd services/product-service
npm install
npm run start:local    # Uses .env.local
# or
npm run dev            # Development mode with nodemon
# Service runs on http://localhost:3002
```

### Running All Services Locally

**Using the provided script:**
```bash
./scripts/run-local.sh
```
This starts all services in the background with local environment configuration.

**Stop all services:**
```bash
./scripts/stop-local.sh
```

### NPM Scripts

Each service has the following npm scripts:
- `npm start` - Start with production environment (`.env.production`)
- `npm run start:local` - Start with local environment (`.env.local`)
- `npm run dev` - Development mode with auto-reload using local environment
- `npm run dev:prod` - Development mode with auto-reload using production environment

### Running Nginx Locally

1. Install Nginx on your system
2. Copy `nginx/nginx.conf` to your Nginx configuration directory
3. Start Nginx service

## API Gateway Endpoints

All requests go through Nginx on port 80:

- `GET /` - API gateway information
- `GET /health` - Gateway health check
- `GET /api/user-service/health` - User service health check
- `GET /api/product-service/health` - Product service health check

All API endpoints are routed through the gateway:
- `/api/users/*` → User Service
- `/api/auth/*` → User Service
- `/api/products` → Product Service
- `/api/orders` → Product Service
- `/api/messages` → Product Service
- `/api/comments` → Product Service

## Testing the API

### Using curl:

**Create a user:**
```bash
curl -X POST http://localhost/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

**Login:**
```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Create a product:**
```bash
curl -X POST http://localhost/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":999.99,"description":"High performance laptop","category":"Electronics"}'
```

**Create an order:**
```bash
curl -X POST http://localhost/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"items":[{"productId":1,"quantity":2}],"shippingAddress":"123 Main St"}'
```

## Project Structure

```
node-kube/
├── docker-compose.yml
├── docker-compose.local.yml
├── nginx/
│   └── nginx.conf
├── scripts/
│   ├── setup-env.sh       # Setup environment files
│   ├── check-env.sh        # Check environment configuration
│   ├── run-local.sh        # Run all services locally
│   └── stop-local.sh       # Stop all local services
├── services/
│   ├── main-service/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── server.js
│   │   ├── env.local.example
│   │   └── env.production.example
│   ├── user-service/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── server.js
│   │   ├── env.local.example
│   │   └── env.production.example
│   └── product-service/
│       ├── Dockerfile
│       ├── package.json
│       ├── server.js
│       ├── env.local.example
│       └── env.production.example
└── README.md
```

## Health Checks

All services include health check endpoints:
- Main Service: `http://localhost:3000/health`
- User Service: `http://localhost:3001/health`
- Product Service: `http://localhost:3002/health`
- Gateway: `http://localhost/health`

## Notes

- Services use in-memory data stores for demonstration purposes
- In production, you would use persistent databases
- Services are containerized and can be scaled independently
- Nginx provides load balancing capabilities (can be extended)

