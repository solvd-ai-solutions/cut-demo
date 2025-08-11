# 🚀 Deployment Guide

This guide will help you deploy the Cut & Order Manager to production.

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Git repository (for automated deployments)

## 🔨 Build Process

### 1. Local Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview the build
npm run preview
```

### 2. Using the Deployment Script

```bash
# Make script executable (first time only)
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Import your repository

2. **Automatic Deployment**
   - Vercel will automatically detect the Vite configuration
   - Deployments happen automatically on every push to main branch
   - Uses the included `vercel.json` configuration

3. **Environment Variables**
   - Set in Vercel dashboard if needed
   - Default values are in `vercel.json`

### Option 2: Netlify

1. **Drag & Drop**
   - Go to [netlify.com](https://netlify.com)
   - Drag the `dist` folder to the deploy area
   - Your app is live instantly

2. **Git Integration**
   - Connect your GitHub repository
   - Automatic deployments on push
   - Custom domain support

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run build
   npm run deploy
   ```

### Option 4: AWS S3

1. **Create S3 Bucket**
   - Enable static website hosting
   - Set bucket policy for public read access

2. **Upload Files**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront** (optional)
   - For global CDN and HTTPS

### Option 5: Any Static Hosting

The application is a standard static website. You can deploy to:
- Firebase Hosting
- Azure Static Web Apps
- DigitalOcean App Platform
- Render
- Railway
- Any web server (Apache, Nginx)

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:

```env
VITE_APP_TITLE=Cut & Order Manager
VITE_APP_VERSION=1.0.0
```

### Build Configuration

The build configuration is in `vite.config.ts`:

- **Output Directory**: `dist/`
- **Source Maps**: Disabled for production
- **Minification**: Enabled with Terser
- **Code Splitting**: Automatic vendor chunking

### Tailwind CSS

- **Purge**: Automatically removes unused CSS
- **Content**: Scans all TypeScript/React files
- **Custom Design System**: Solv Solutions brand colors

## 📱 PWA Features

The application includes PWA capabilities:

- **Manifest**: `public/manifest.json`
- **Service Worker**: Ready for implementation
- **Offline Support**: Can be added with workbox
- **Install Prompt**: Users can install as app

## 🚨 Troubleshooting

### Build Errors

1. **TypeScript Errors**
   ```bash
   npm run type-check
   ```

2. **Linting Issues**
   ```bash
   npm run lint
   npm run lint:fix
   ```

3. **Dependency Issues**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Runtime Errors

1. **Check Browser Console**
2. **Verify Build Output**
3. **Check Network Tab for 404s**

### Performance Issues

1. **Bundle Analysis**
   ```bash
   npm run build
   # Check dist/assets/ for file sizes
   ```

2. **Lighthouse Audit**
   - Use Chrome DevTools
   - Check Core Web Vitals

## 🔒 Security Considerations

- **HTTPS**: Always use HTTPS in production
- **CSP**: Content Security Policy headers
- **XSS Protection**: Built-in React protection
- **Input Validation**: All user inputs are validated

## 📊 Monitoring

### Analytics

- **Google Analytics**: Add tracking code
- **Error Tracking**: Sentry or similar
- **Performance**: Web Vitals monitoring

### Health Checks

- **Uptime Monitoring**: Pingdom, UptimeRobot
- **Error Alerting**: Set up notifications
- **Performance Monitoring**: Real User Monitoring

## 🚀 Post-Deployment

### 1. Verify Functionality
- Test all major features
- Check mobile responsiveness
- Verify print functionality

### 2. Performance Testing
- Run Lighthouse audit
- Check Core Web Vitals
- Test on slow networks

### 3. SEO Verification
- Check meta tags
- Verify Open Graph
- Test social media sharing

### 4. Accessibility Testing
- Screen reader compatibility
- Keyboard navigation
- Color contrast

## 📞 Support

For deployment issues:

- **Documentation**: Check this guide
- **Issues**: GitHub repository
- **Contact**: support@solvsolutions.com

---

**Happy Deploying! 🎉**

Your Cut & Order Manager is now ready for production use.
