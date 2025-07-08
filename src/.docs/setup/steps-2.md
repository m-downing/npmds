# @company/core-ui Integration Guide - React 16.x & React Router v5

This guide provides instructions for integrating the @company/core-ui design system into React applications using React 16.x and React Router v5.

## ⚠️ Compatibility Notes

The design system is optimized for React 16.14.0+, but should work with React 16.13.1 with these considerations:

1. **React Version**: The design system specifies React `^16.14.0` as minimum, but 16.13.1 is close enough that it should work for most features
2. **React Router**: This guide uses React Router v5 syntax (different from v6)
3. **Some features may have limited support** in older React versions

Consider upgrading to React 16.14.0+ if you encounter issues.

## Prerequisites

Your React app should have these dependencies:
- React 16.13.1+
- React DOM 16.13.1+
- TypeScript 4.x or 5.x
- Tailwind CSS 3.x
- React Router DOM 5.x

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

### 1.4 Ensure React Router v5 Types (if using TypeScript)

```bash
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

## Step 6: Create Layout Component (React Router v5)

### 6.1 Create Layout Wrapper

Create `src/components/Layout.tsx` with React Router v5 hooks:

```typescript
import React, { useState } from 'react';
import { AppLayout } from '@company/core-ui';
import { sidebarConfig } from '../config/sidebar.config';
import { useLocation, useHistory } from 'react-router-dom'; // v5 imports

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const history = useHistory(); // v5 uses useHistory instead of useNavigate
  const [notificationCount, setNotificationCount] = useState(3);
  const [activeTab, setActiveTab] = useState('main');
  const [loadingTab, setLoadingTab] = useState<string | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const handleNavigate = (path: string) => {
    // Set loading state
    setLoadingTab(path);
    
    // Navigate after a short delay to show loading state
    setTimeout(() => {
      history.push(path); // v5 uses history.push instead of navigate
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

Create `src/components/PageHeader.tsx`:

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

## Step 7: Update Your App Component (React Router v5)

### 7.1 Update App.tsx with React Router v5 Syntax

Replace your `src/App.tsx` with:

```typescript
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'; // v5 imports
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
        <Switch> {/* v5 uses Switch instead of Routes */}
          <Route exact path="/" component={HomePage} /> {/* v5 syntax */}
          <Route path="/dashboard" component={DashboardPage} />
          {/* Add more routes matching your sidebar navigation */}
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
```

### 7.2 Alternative App.tsx Using Render Props (React Router v5)

If you prefer render props pattern:

```typescript
function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" render={() => <HomePage />} />
          <Route path="/dashboard" render={() => <DashboardPage />} />
          {/* Add more routes */}
        </Switch>
      </Layout>
    </Router>
  );
}
```

### 7.3 Update index.tsx (Optional - for theme support)

For React 16.x, update `src/index.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom'; // Note: Not react-dom/client in React 16
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker'; // If using CRA with React 16

// Initialize theme before React renders
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
};

initTheme();

// React 16 render method
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If using Create React App with React 16
serviceWorker.unregister();
```

## Step 8: Polyfills and Compatibility

### 8.1 Add Polyfills (if needed)

Some modern JavaScript features used by the design system might need polyfills for older browsers:

```bash
npm install --save core-js
```

Add to the top of `src/index.tsx`:

```typescript
import 'core-js/stable';
```

## Step 9: Clean Up

Remove any files that are no longer needed:
- `src/App.css` (if using only Tailwind)
- `src/logo.svg` (if not using)

## Step 10: Run Your App

```bash
npm start
```

## React Router v5 vs v6 Key Differences

| Feature | React Router v5 | React Router v6 |
|---------|----------------|-----------------|
| Route Definition | `<Route path="/path" component={Component} />` | `<Route path="/path" element={<Component />} />` |
| Switch | `<Switch>` | `<Routes>` |
| Navigation Hook | `useHistory()` | `useNavigate()` |
| Navigate Method | `history.push('/path')` | `navigate('/path')` |
| Exact Matching | `exact` prop required | Exact by default |

## Known Limitations with React 16.13.1

1. **React.memo**: Limited support in older versions
2. **Hooks**: Some newer hook patterns might not work
3. **Concurrent Features**: Not available
4. **Error Boundaries**: Limited error handling

## Troubleshooting

### Common Issues with React 16.x

1. **"Cannot read property 'ReactCurrentDispatcher' of undefined"**
   - Solution: Ensure all React-related packages are the same version

2. **Hook errors**
   - Solution: Check that all components follow Rules of Hooks
   - Ensure no duplicate React versions: `npm ls react`

3. **TypeScript errors**
   - Solution: You might need to adjust tsconfig.json:
   ```json
   {
     "compilerOptions": {
       "jsx": "react",
       "skipLibCheck": true
     }
   }
   ```

4. **Build errors with modern syntax**
   - Solution: Ensure your build tools support the JavaScript features used

### Checking for Multiple React Versions

Run this command to check for duplicate React installations:

```bash
npm ls react react-dom
```

All versions should match your project's version (16.13.1).

## Recommended Upgrade Path

While the design system should work with React 16.13.1, we recommend upgrading to at least React 16.14.0 for better compatibility:

```bash
npm update react@^16.14.0 react-dom@^16.14.0
```

Or for a more significant upgrade to React 18:

```bash
npm install react@^18.0.0 react-dom@^18.0.0 react-router-dom@^6.0.0
```

Then follow the React 18 integration guide instead.

## Support

For React 16.x specific issues:
1. Check React 16 documentation
2. Verify all peer dependencies are compatible
3. Consider upgrading to a newer React version for full feature support
