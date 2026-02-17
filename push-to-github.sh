#!/bin/bash

# UltraStream - GitHub Push Script
# This script will push your code to GitHub

echo "=========================================="
echo "UltraStream - GitHub Push Script"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the ultrastream directory"
    exit 1
fi

echo "📋 Repository: https://github.com/Arkhan1986/ultrastream"
echo ""

# Check if remote already exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "✅ Remote 'origin' already configured"
else
    echo "🔧 Adding GitHub remote..."
    git remote add origin https://github.com/Arkhan1986/ultrastream.git
    echo "✅ Remote added"
fi

echo ""
echo "🌿 Renaming branch to main..."
git branch -M main

echo ""
echo "🚀 Pushing to GitHub..."
echo ""
echo "⚠️  You will be prompted for credentials:"
echo "   Username: Arkhan1986"
echo "   Password: [Use your Personal Access Token]"
echo ""
echo "   Get your token at: https://github.com/settings/tokens"
echo ""

# Push to GitHub
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ SUCCESS! Code pushed to GitHub"
    echo "=========================================="
    echo ""
    echo "View your repository at:"
    echo "https://github.com/Arkhan1986/ultrastream"
    echo ""
    echo "Next steps:"
    echo "1. Deploy to Vercel: https://vercel.com/new"
    echo "2. Add environment variables"
    echo "3. Test your live app!"
else
    echo ""
    echo "=========================================="
    echo "❌ Push failed"
    echo "=========================================="
    echo ""
    echo "Common issues:"
    echo "1. Repository doesn't exist - Create it at https://github.com/new"
    echo "2. Wrong credentials - Use Personal Access Token, not password"
    echo "3. No permission - Check token has 'repo' scope"
    echo ""
    echo "See GITHUB_SETUP.md for detailed instructions"
fi
