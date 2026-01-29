#!/bin/bash

# Script to set up environment files for all services
# This script copies example env files to actual .env files

set -e

echo "Setting up environment files..."

# Function to copy env file if it doesn't exist
copy_env_file() {
    local service_dir=$1
    local env_type=$2
    
    if [ ! -f "$service_dir/.env.$env_type" ]; then
        if [ -f "$service_dir/env.$env_type.example" ]; then
            cp "$service_dir/env.$env_type.example" "$service_dir/.env.$env_type"
            echo "✓ Created $service_dir/.env.$env_type"
        else
            echo "✗ Example file not found: $service_dir/env.$env_type.example"
        fi
    else
        echo "⊘ $service_dir/.env.$env_type already exists, skipping..."
    fi
}

# Setup for each service
SERVICES=("main-service" "user-service" "product-service")

for service in "${SERVICES[@]}"; do
    SERVICE_DIR="services/$service"
    
    if [ -d "$SERVICE_DIR" ]; then
        echo ""
        echo "Setting up $service..."
        copy_env_file "$SERVICE_DIR" "local"
        copy_env_file "$SERVICE_DIR" "production"
    else
        echo "✗ Service directory not found: $SERVICE_DIR"
    fi
done

echo ""
echo "Environment setup complete!"
echo ""
echo "To use local environment, run: npm run start:local or npm run dev"
echo "To use production environment, run: npm start"

