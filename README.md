# Cut & Order Manager

A production-ready, pixel-perfect web application for hardware store management, featuring custom cutting jobs and inventory management.

## 🚀 Features

- **Cut Job Management**: Create and manage custom cutting orders with real-time cost calculations
- **Inventory Management**: Track stock levels, set reorder thresholds, and manage suppliers
- **Job Tracking**: Monitor job status from pending to completion
- **Professional UI**: Modern, accessible interface built with React and Tailwind CSS
- **Print Integration**: Generate professional cutting tickets for customers
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: WCAG compliant with screen reader support and keyboard navigation

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: Local Storage + React Hooks
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
├── components/          # React components
│   ├── CutJobForm.tsx  # Cut job creation form
│   ├── Dashboard.tsx   # Main dashboard view
│   ├── JobManager.tsx  # Job management interface
│   └── InventoryManager.tsx # Inventory management
├── services/           # Business logic and data
│   └── dataStore.ts   # Data persistence layer
├── types/              # TypeScript type definitions
│   └── index.ts       # Core interfaces
├── utils/              # Utility functions
│   └── index.ts       # Common helpers
├── styles/             # CSS and styling
│   └── globals.css    # Global styles and design system
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.html         # HTML template
```

## 🎨 Design System

The application uses a custom design system built on Tailwind CSS with the following color palette:

- **Primary (Teal)**: #4FB3A6 - Used for primary actions and highlights
- **Secondary (Coral)**: #F29E8E - Used for secondary actions and warnings
- **Accent (Lavender)**: #C5A3E0 - Used for informational elements
- **Neutral**: Black (#000000) and White (#FFFFFF) for text and backgrounds

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_APP_TITLE=Cut & Order Manager
VITE_APP_VERSION=1.0.0
```

### Tailwind Configuration

The Tailwind configuration is located in `tailwind.config.js` and includes custom extensions for the design system.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility Features

- **Screen Reader Support**: ARIA labels and live regions
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Color Contrast**: WCAG AA compliant color combinations

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with UI
npm run test:ui

# Type checking
npm run type-check
```

## 📦 Build & Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

The production build will be created in the `dist/` directory.

### Deployment

The application can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Use the `gh-pages` package
- **AWS S3**: Upload the `dist/` folder to an S3 bucket

## 🔒 Security Considerations

- All user inputs are validated and sanitized
- No sensitive data is stored in localStorage
- XSS protection through proper React practices
- CSRF protection through proper form handling

## 📊 Performance

- **Code Splitting**: Automatic chunk splitting for optimal loading
- **Lazy Loading**: Components load on demand
- **Optimized Assets**: Images and fonts are optimized
- **Bundle Analysis**: Use `npm run build` to analyze bundle size

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**: Change the port in `vite.config.ts`
2. **Build Errors**: Clear `node_modules` and reinstall dependencies
3. **TypeScript Errors**: Run `npm run type-check` to identify issues

### Getting Help

- Check the browser console for error messages
- Verify all dependencies are installed correctly
- Ensure Node.js version meets requirements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Solv Solutions** - Business requirements and domain expertise
- **React Team** - Amazing framework
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide** - Beautiful icon set

## 📞 Support

For support or questions:
- **Phone**: 781-363-6080
- **Company**: Solv Solutions
- **Email**: support@solvsolutions.com

---

**Built with ❤️ by the Solv Solutions team**
