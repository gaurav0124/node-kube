#!/bin/bash

# Script to lint Helm charts

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$PROJECT_ROOT"

echo "Linting Helm charts..."
echo ""

# Check if helm is installed
if ! command -v helm &> /dev/null; then
    echo "Error: Helm is not installed"
    echo "Install it from: https://helm.sh/docs/intro/install/"
    exit 1
fi

# Lint each chart
CHARTS=$(find . -name "Chart.yaml" -type f)

if [ -z "$CHARTS" ]; then
    echo "No Helm charts found"
    exit 0
fi

for chart in $CHARTS; do
    chart_dir=$(dirname "$chart")
    chart_name=$(basename "$chart_dir")
    
    echo "=========================================="
    echo "Linting chart: $chart_name"
    echo "Location: $chart_dir"
    echo "=========================================="
    
    # Run helm lint
    if helm lint "$chart_dir"; then
        echo "✓ Chart '$chart_name' passed linting"
    else
        echo "✗ Chart '$chart_name' failed linting"
        exit_code=1
    fi
    
    # Try to template (dry-run)
    echo ""
    echo "Testing template rendering..."
    if helm template test "$chart_dir" --debug > /dev/null 2>&1; then
        echo "✓ Templates render successfully"
    else
        echo "✗ Template rendering failed"
        echo "Run 'helm template test $chart_dir --debug' for details"
        exit_code=1
    fi
    
    echo ""
done

if [ -z "$exit_code" ]; then
    echo "All charts passed linting!"
    exit 0
else
    echo "Some charts failed linting"
    exit 1
fi

