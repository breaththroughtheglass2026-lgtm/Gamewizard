#!/bin/bash

# CANVAS Installer Script
# This script helps you set up your API keys and dependencies

echo "🎮 CANVAS Setup Wizard"
echo "======================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local already exists"
else
    echo "📝 .env.local not found. Let's create it!"
    echo ""
    echo "1. Get your free API key from: https://console.groq.com/"
    echo ""
    read -p "Enter your GROQ API Key: " api_key
    
    if [ -z "$api_key" ]; then
        echo "❌ API Key is required!"
        exit 1
    fi
    
    # Create .env.local
    cat > .env.local << EOF
GROQ_API_KEY=$api_key
PORT=3001
NODE_ENV=development
EOF
    
    echo "✅ .env.local created successfully!"
fi

echo ""
echo "📦 Installing dependencies..."
if npm install; then
    echo "✅ Dependencies installed!"
else
    echo "❌ npm install failed"
    exit 1
fi

echo ""
echo "🧪 Testing API Key..."
npm start &
SERVER_PID=$!
sleep 3

if curl -s http://localhost:3001/api/test-key | grep -q "working"; then
    echo "✅ API Key is working!"
    echo ""
    echo "🚀 Server is running at http://localhost:3001"
    echo ""
    echo "Press Ctrl+C to stop the server"
    wait $SERVER_PID
else
    echo "❌ API Key test failed"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi
