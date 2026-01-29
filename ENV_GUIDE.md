# Environment Configuration Guide

This guide explains how to set up and use environment variables for all services.

## Quick Start

1. **Initial Setup:**
   ```bash
   ./scripts/setup-env.sh
   ```

2. **Verify Configuration:**
   ```bash
   ./scripts/check-env.sh
   ```

## Environment Files Structure

Each service has two environment file templates:
- `env.local.example` - Template for local development
- `env.production.example` - Template for production

After running `setup-env.sh`, actual `.env.local` and `.env.production` files are created.

## Running Services with Different Environments

### Local Development

**Option 1: Using npm scripts (recommended)**
```bash
cd services/main-service
npm run start:local    # Uses .env.local
npm run dev            # Development with auto-reload
```

**Option 2: Using scripts**
```bash
./scripts/run-local.sh    # Start all services with local env
./scripts/stop-local.sh    # Stop all services
```

### Production

**Option 1: Using npm scripts**
```bash
cd services/main-service
npm start    # Uses .env.production
```

**Option 2: Using Docker**
```bash
docker-compose up -d    # Uses .env.production
```

**Option 3: Using Docker with local env**
```bash
docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d
```

## Environment Variables Reference

### Common Variables (All Services)

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NODE_ENV` | Environment mode | `development` | `production` |
| `PORT` | Service port | Service-specific | `3000` |
| `SERVICE_NAME` | Service identifier | Service-specific | `main-service` |
| `LOG_LEVEL` | Logging level | `info` | `debug`, `info`, `warn`, `error` |
| `API_PREFIX` | API route prefix | `/api` | `/api` |
| `CORS_ORIGIN` | Allowed CORS origins | Service-specific | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` | `50` |
| `REQUEST_TIMEOUT` | Request timeout (ms) | `30000` | `20000` |

### User Service Specific

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `JWT_SECRET` | JWT signing secret | `default_secret` | `your-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration | `24h` | `24h`, `7d` |

### Product Service Specific

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `USER_SERVICE_URL` | User service URL | `http://localhost:3001` | `http://user-service:3001` |

## Customizing Environment Files

1. **Edit the example files** (if you want to change defaults):
   ```bash
   nano services/main-service/env.local.example
   ```

2. **Run setup script** to regenerate actual env files:
   ```bash
   ./scripts/setup-env.sh
   ```

3. **Or edit actual env files directly**:
   ```bash
   nano services/main-service/.env.local
   ```

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` or `.env.production` files to version control
- Always use strong secrets in production (especially `JWT_SECRET`)
- Update `CORS_ORIGIN` to match your actual domain in production
- Review all environment variables before deploying to production

## Troubleshooting

### Environment file not loading?

1. Check if the file exists:
   ```bash
   ls -la services/main-service/.env.local
   ```

2. Verify file format (no spaces around `=`):
   ```bash
   # Correct
   PORT=3000
   
   # Wrong
   PORT = 3000
   ```

3. Check which environment is being used:
   ```bash
   ./scripts/check-env.sh
   ```

### Service not using correct port?

Check the environment file:
```bash
grep PORT services/main-service/.env.local
```

Make sure you're using the correct npm script:
- `npm run start:local` → Uses `.env.local`
- `npm start` → Uses `.env.production`

