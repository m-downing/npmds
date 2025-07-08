# @company/core-ui Integration Guide

This guide provides step-by-step instructions for integrating the @company/core-ui design system into React applications using Create React App or similar setups.

## Prerequisites

Your React app should have these core dependencies:
- React 18.x
- React DOM 18.x
- TypeScript 4.x or 5.x
- Tailwind CSS 3.x
- React Router DOM 6.x (for navigation)

## Step 1: Install Required Packages

### 1.1 Install the Design System Package

```bash
# Using the tarball file (during development)
npm install /path/to/company-core-ui-2.0.0.tgz

# Or from npm registry (once published)
npm install @company/core-ui
```

### 1.2 Install Peer Dependencies

```bash
npm install @heroicons/react@^2.0.0
```

### 1.3 Install Development Dependencies (if not already installed)

```bash
npm install -D tailwindcss@^3.4.1 postcss@^8.4.0 autoprefixer@^10.4.0
```

### 1.4 Install React Router (for navigation)

```bash
npm install react-router-dom@^6.0.0
npm install -D @types/react-router-dom@^5.3.3
```

## Step 2: Configure Tailwind CSS

### 2.1 Update tailwind.config.js

Replace your existing `tailwind.config.js` with:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('@company/core-ui/tailwind.preset')
  ],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@company/core-ui/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // Add any app-specific customizations here
    },
  },
  plugins: [],
}
```

### 2.2 Update postcss.config.js

Ensure your `postcss.config.js` looks like:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## Step 3: Import Design System Styles

### 3.1 Update src/index.css

Replace the contents of your `src/index.css` with:

```css
/* Import the design system styles FIRST */
@import '@company/core-ui/styles';

/* Then your Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Any custom app styles below */
```

## Step 4: Create Required Assets

### 4.1 Create Icon Directory Structure

In your `public` directory, create the following structure:

```bash
mkdir -p public/icons/vertical-nav
mkdir -p public/icons/ui
mkdir -p public/app-logos
```

### 4.2 Add App Switcher Icon

Create `public/icons/vertical-nav/app-switcher.svg`:

```svg
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="6" height="6" rx="1" fill="currentColor" opacity="0.8"/>
  <rect x="12" y="2" width="6" height="6" rx="1" fill="currentColor" opacity="0.8"/>
  <rect x="2" y="12" width="6" height="6" rx="1" fill="currentColor" opacity="0.8"/>
  <rect x="12" y="12" width="6" height="6" rx="1" fill="currentColor" opacity="0.8"/>
</svg>
```

### 4.3 Add Your App Logo

Add your app logo to `public/app-logos/` or use an existing logo from `public/`.

## Step 5: Configure the Sidebar

### 5.1 Create Sidebar Configuration

Create `src/config/sidebar.config.tsx`:

```typescript
import { 
  HomeIcon, 
  ChartBarIcon, 
  CogIcon,
  DocumentTextIcon,
  UsersIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import type { SidebarConfig } from '@company/core-ui';

export const sidebarConfig: SidebarConfig = {
  // Main app configuration
  app: {
    name: 'Your App Name',
    logoSrc: '/app-logos/your-logo.svg', // Path to your logo
    homeUrl: '/'
  },
  
  // Navigation items
  navigation: [
    { 
      name: 'Home', 
      icon: HomeIcon, 
      path: '/' 
    },
    { 
      name: 'Dashboard', 
      icon: ChartBarIcon, 
      path: '/dashboard' 
    },
    // Add more navigation items as needed
  ],
  
  // App switcher configuration (optional)
  appSwitcher: {
    enabled: true,
    apps: [
      { 
        name: 'App 1', 
        logoSrc: '/app-logos/app1.svg', 
        href: 'https://app1.example.com' 
      },
      { 
        name: 'App 2', 
        logoSrc: BeakerIcon, // Can use Heroicons
        href: 'https://app2.example.com' 
      }
    ]
  },
  
  // AI Assistant configuration (optional)
  aiAssistant: {
    enabled: true,
    name: 'AI Assistant',
    placeholder: 'Ask me anything...'
  },
  
  // Notifications configuration (optional)
  notifications: {
    enabled: true
  }
};
```

## Step 6: Create Layout Component

### 6.1 Create Layout Wrapper

Create `src/components/Layout.tsx`:

```typescript
import React, { useState } from 'react';
import { AppLayout } from '@company/core-ui';
import { sidebarConfig } from '../config/sidebar.config';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(3);
  const [activeTab, setActiveTab] = useState('main');
  const [loadingTab, setLoadingTab] = useState<string | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleNavigate = (path: string) => {
    // Set loading state
    setLoadingTab(path);
    
    // Navigate after a short delay to show loading state
    setTimeout(() => {
      navigate(path);
      setLoadingTab(null);
    }, 300);
  };

  const handleNotificationClick = () => {
    console.log('Notifications clicked');
    // Reset notification count or open notification panel
    setNotificationCount(0);
  };

  const handleAIAssistantClick = () => {
    console.log('AI Assistant clicked');
    // Open AI assistant modal or panel
    // You can integrate your AI chat component here
  };

  const sidebarProps = {
    isExpanded: isSidebarExpanded,
    onExpandedChange: setIsSidebarExpanded,
    config: sidebarConfig,
    currentPath: location.pathname,
    onNavigate: handleNavigate,
    notificationCount: notificationCount,
    onNotificationClick: handleNotificationClick,
    onAIAssistantClick: handleAIAssistantClick,
    activeTab: activeTab,
    onActiveTabChange: setActiveTab,
    loadingTab: loadingTab,
    onLoadingChange: setLoadingTab,
    // Optional: Add storage handlers for persistence
    onStorageSet: (key: string, value: string) => localStorage.setItem(key, value),
    onStorageGet: (key: string) => localStorage.getItem(key),
  };

  const accountDrawerProps = {
    // Customize with your user data
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    userAvatar: '/path/to/avatar.png',
  };

  return (
    <AppLayout
      sidebarProps={sidebarProps}
      accountDrawerProps={accountDrawerProps}
      showAccountDrawer={true}
      showInfoBanner={true}
      showCriticalBanner={false}
      onThemeInit={() => {
        // Initialize theme from localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
      }}
    >
      {children}
    </AppLayout>
  );
};
```

### 6.2 Create Page Header Component (Optional)

Create `src/components/PageHeader.tsx` for consistent page headers:

```typescript
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{title}</h1>
      {description && (
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">{description}</p>
      )}
      {children}
    </div>
  );
};
```

## Step 7: Update Your App Component

### 7.1 Update App.tsx

Replace your `src/App.tsx` with:

```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PageContainer } from '@company/core-ui';
import { PageHeader } from './components/PageHeader';

// Example page components
const HomePage = () => (
  <PageContainer>
    <PageHeader title="Home" description="Welcome to your app" />
    <div className="space-y-4">
      {/* Your home page content */}
    </div>
  </PageContainer>
);

const DashboardPage = () => (
  <PageContainer>
    <PageHeader title="Dashboard" description="Analytics and metrics" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Your dashboard content */}
    </div>
  </PageContainer>
);

// Add more pages as needed...

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Add more routes matching your sidebar navigation */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
```

### 7.2 Update index.tsx (Optional - for theme support)

Update `src/index.tsx` to initialize theme before React renders:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Initialize theme before React renders
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
};

initTheme();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
```

## Step 8: Clean Up

Remove any files that are no longer needed:
- `src/App.css` (if using only Tailwind)
- `src/logo.svg` (if not using)

## Step 9: Run Your App

```bash
npm start
```

## What You Get

After following these steps, your app will have:

- ✅ **Sidebar Navigation** - Collapsible sidebar with your configured navigation
- ✅ **App Switcher** - Quick switch between different apps
- ✅ **AI Assistant** - AI chat interface (implement your own chat logic)
- ✅ **Dark Mode** - Automatic theme switching support
- ✅ **System Banners** - Info and critical banners for announcements
- ✅ **Account Drawer** - User account management
- ✅ **Page Container** - Consistent page layout wrapper
- ✅ **Loading States** - Built-in loading indicators
- ✅ **Responsive Design** - Mobile-friendly layout
- ✅ **Notification Badge** - Shows notification count

## Using Design System Components

You can import and use any component from the design system:

```typescript
import { 
  Button, 
  Input, 
  Badge, 
  Spinner,
  Card,
  // ... more components
} from '@company/core-ui';

// Use in your components
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>

<Badge variant="success">Active</Badge>
```

## Customization

### Theme Colors
All design system colors are available as Tailwind classes:
- Primary: `text-primary-600`, `bg-primary-100`, etc.
- Neutral: `text-neutral-900`, `bg-neutral-50`, etc.
- Success/Warning/Error: Similar patterns

### Badge Colors
Special badge colors are available:
- `bg-badge-forecast-bg text-badge-forecast-text`
- `bg-badge-completed-bg text-badge-completed-text`
- And many more...

### Extending Styles
Add custom styles in your `tailwind.config.js` under `theme.extend`.

## Troubleshooting

### Common Issues

1. **Module not found errors**: Ensure all paths in imports are correct
2. **Styling issues**: Make sure `@import '@company/core-ui/styles'` is at the top of index.css
3. **Icons not showing**: Check that icon files exist in `public/icons/`
4. **TypeScript errors**: Ensure all @types packages are installed
5. **Dark mode not working**: Check that theme initialization runs before React renders

### Version Compatibility

This guide is tested with:
- React 18.3.x
- TypeScript 4.9.x or 5.x
- Tailwind CSS 3.4.x
- React Router DOM 6.x

## Support

For issues or questions:
1. Check the component documentation
2. Review the example implementations
3. Contact the design system team
