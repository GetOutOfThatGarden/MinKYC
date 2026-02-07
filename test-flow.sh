#!/bin/bash
# MinKYC End-to-End Test Script
# Run this to verify the full flow works before submission

echo "=========================================="
echo "MinKYC End-to-End Test"
echo "=========================================="
echo ""

# Check if tools are available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js."
    exit 1
fi

echo "✅ Node.js/npx available"
echo ""

# Step 1: Create identity
echo "Step 1: Creating identity..."
npx tsx cli/src/index.ts identity init
if [ $? -ne 0 ]; then
    echo "❌ Identity creation failed"
    exit 1
fi
echo ""

# Step 2: Check status
echo "Step 2: Checking identity status..."
npx tsx cli/src/index.ts status
if [ $? -ne 0 ]; then
    echo "❌ Status check failed"
    exit 1
fi
echo ""

# Step 3: Create platform request
echo "Step 3: Creating platform request..."
npx tsx cli/src/index.ts platform request --over-18
if [ $? -ne 0 ]; then
    echo "❌ Platform request failed"
    exit 1
fi
echo ""

# Step 4: Generate and verify proof
echo "Step 4: Generating and verifying proof..."
npx tsx cli/src/index.ts prove
if [ $? -ne 0 ]; then
    echo "❌ Proof verification failed"
    exit 1
fi
echo ""

echo "=========================================="
echo "✅ All tests passed!"
echo "=========================================="
echo ""
echo "Your MinKYC deployment is working correctly."
echo "Ready for hackathon submission!"
