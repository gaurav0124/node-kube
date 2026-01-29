#!/bin/bash

# Script to stop all locally running services

set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Get the project root directory (parent of scripts directory)
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Change to project root
cd "$PROJECT_ROOT"

echo "Stopping all services..."

SERVICES=("main-service" "user-service" "product-service")

for service in "${SERVICES[@]}"; do
    PID_FILE="$PROJECT_ROOT/logs/$service.pid"
    
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            kill "$PID" 2>/dev/null || true
            echo "✓ Stopped $service (PID: $PID)"
        else
            echo "⊘ $service was not running"
        fi
        rm -f "$PID_FILE"
    else
        echo "⊘ No PID file found for $service"
    fi
done

echo ""
echo "All services stopped!"

