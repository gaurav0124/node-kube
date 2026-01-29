#!/bin/bash

# Script to check environment configuration for all services

echo "Checking environment files for all services..."
echo ""

SERVICES=("main-service" "user-service" "product-service")

for service in "${SERVICES[@]}"; do
    SERVICE_DIR="services/$service"
    
    echo "=== $service ==="
    
    if [ -d "$SERVICE_DIR" ]; then
        # Check local env
        if [ -f "$SERVICE_DIR/.env.local" ]; then
            echo "✓ .env.local exists"
            echo "  Port: $(grep '^PORT=' "$SERVICE_DIR/.env.local" | cut -d '=' -f2 || echo 'not set')"
            echo "  Node Env: $(grep '^NODE_ENV=' "$SERVICE_DIR/.env.local" | cut -d '=' -f2 || echo 'not set')"
        else
            echo "✗ .env.local missing"
        fi
        
        # Check production env
        if [ -f "$SERVICE_DIR/.env.production" ]; then
            echo "✓ .env.production exists"
            echo "  Port: $(grep '^PORT=' "$SERVICE_DIR/.env.production" | cut -d '=' -f2 || echo 'not set')"
            echo "  Node Env: $(grep '^NODE_ENV=' "$SERVICE_DIR/.env.production" | cut -d '=' -f2 || echo 'not set')"
        else
            echo "✗ .env.production missing"
        fi
    else
        echo "✗ Service directory not found: $SERVICE_DIR"
    fi
    
    echo ""
done

