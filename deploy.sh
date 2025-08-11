#!/bin/bash

# Cut & Order Manager Deployment Script
# This script builds and prepares the application for deployment

echo "🚀 Building Cut & Order Manager for production..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📁 Build output:"
    echo "   - HTML: dist/index.html"
    echo "   - CSS: dist/assets/index-*.css"
    echo "   - JS: dist/assets/index-*.js"
    echo "   - Vendor: dist/assets/vendor-*.js"
    echo ""
    echo "🌐 To preview the build:"
    echo "   npm run preview"
    echo ""
    echo "📤 To deploy:"
    echo "   - Upload the 'dist' folder to your hosting service"
    echo "   - Or use the included Vercel configuration"
    echo ""
    echo "🎯 Deployment options:"
    echo "   1. Vercel: Connect your GitHub repo and deploy automatically"
    echo "   2. Netlify: Drag and drop the 'dist' folder"
    echo "   3. GitHub Pages: Use gh-pages package"
    echo "   4. AWS S3: Upload 'dist' folder to S3 bucket"
    echo "   5. Any static hosting service"
else
    echo "❌ Build failed!"
    exit 1
fi
