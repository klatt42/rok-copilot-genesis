#!/bin/bash

# ROK Copilot Setup Script
# This script helps you set up the development environment

set -e

echo "🚀 ROK Copilot Setup"
echo "===================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version must be 20 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "✅ .env.local created"
    echo ""
    echo "⚠️  IMPORTANT: You need to add your API keys to .env.local:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - ANTHROPIC_API_KEY"
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Install dependencies
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

# Check if Supabase variables are set
if grep -q "your_supabase_project_url" .env.local 2>/dev/null; then
    echo "⚠️  Reminder: Update your Supabase credentials in .env.local"
    echo ""
fi

if grep -q "your_anthropic_api_key" .env.local 2>/dev/null; then
    echo "⚠️  Reminder: Update your Anthropic API key in .env.local"
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your API keys"
echo "2. Set up your Supabase project (see README.md)"
echo "3. Run 'npm run dev' to start the development server"
echo ""
