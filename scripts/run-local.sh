#!/bin/bash

# Script to run all services locally with local environment

set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Get the project root directory (parent of scripts directory)
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Change to project root
cd "$PROJECT_ROOT"

echo "Starting all services in local mode..."
echo ""

# Create logs directory in project root
mkdir -p "$PROJECT_ROOT/logs"

# Function to start a service
start_service() {
    local service_dir=$1
    local service_name=$2
    local port=$3
    
    if [ -d "$service_dir" ]; then
        echo "Starting $service_name on port $port..."
        cd "$service_dir"
        
        # Check if node_modules exists, if not install
        if [ ! -d "node_modules" ]; then
            echo "Installing dependencies for $service_name..."
            npm install
        fi
        
        # Start service in background, redirect output to logs in project root
        npm run start:local > "$PROJECT_ROOT/logs/$service_name.log" 2>&1 &
        local pid=$!
        echo $pid > "$PROJECT_ROOT/logs/$service_name.pid"
        echo "✓ $service_name started (PID: $pid)"
        cd "$PROJECT_ROOT"
    else
        echo "✗ Service directory not found: $service_dir"
    fi
}

# Start services
start_service "services/main-service" "main-service" "3000"
sleep 2

start_service "services/user-service" "user-service" "3001"
sleep 2

start_service "services/product-service" "product-service" "3002"

echo ""
echo "All services started!"
echo "Check logs in the logs/ directory"
echo ""
echo "To stop all services, run: ./scripts/stop-local.sh"

