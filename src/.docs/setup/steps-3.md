# @company/core-ui Integration Guide - React 16.14.0 & React Router v5

This guide provides instructions for integrating the @company/core-ui design system into React applications using React 16.14.0 and React Router v5.1.2.

## ✅ Perfect Compatibility

Your app uses React 16.14.0, which exactly matches the design system's minimum React version requirement. This ensures:

- Full feature compatibility
- No version conflicts
- Optimal performance
- All design system features work as intended

## Prerequisites

Your React app should have these dependencies:
- React 16.14.0
- React DOM 16.14.0
- TypeScript 4.x or 5.x
- Tailwind CSS 3.x
- React Router DOM 5.1.2+

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
  BeakerIcon,
  FolderIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import type { SidebarConfig } from '@company/core-ui';

export const sidebarConfig: SidebarConfig = {
  // Main app configuration
  app: {
    name: 'Your App Name',
    logoSrc: '/app-logos/your-logo.svg', // Path to your logo
    homeUrl: '/'
  },
  
  // Navigation items - customize based on your app's structure
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
    { 
      name: 'Projects',
      icon: FolderIcon,
      path: '/projects'
    },
    { 
      name: 'Components',
      icon: CubeIcon,
      path: '/components'
    },
    { 
      name: 'Documents', 
      icon: DocumentTextIcon, 
      path: '/documents' 
    },
    { 
      name: 'Team', 
      icon: UsersIcon, 
      path: '/team' 
    },
    { 
      name: 'Settings', 
      icon: CogIcon, 
      path: '/settings' 
    }
  ],
  
  // App switcher configuration (optional)
  appSwitcher: {
    enabled: true,
    apps: [
      { 
        name: 'Main App', 
        logoSrc: '/app-logos/main-app.svg', 
        href: 'https://main.yourcompany.com' 
      },
      { 
        name: 'Analytics', 
        logoSrc: ChartBarIcon, // Can use Heroicons
        href: 'https://analytics.yourcompany.com' 
      },
      { 
        name: 'Admin Portal', 
        logoSrc: CogIcon,
        href: 'https://admin.yourcompany.com' 
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
import React, { useState, useEffect } from 'react';
import { AppLayout, AIChatBox, type Message } from '@company/core-ui';
import { sidebarConfig } from '../config/sidebar.config';
import { useLocation, useHistory } from 'react-router-dom'; // v5 imports

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const history = useHistory(); // v5 uses useHistory
  const [notificationCount, setNotificationCount] = useState(3);
  const [activeTab, setActiveTab] = useState('');
  const [loadingTab, setLoadingTab] = useState<string | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false); // Add for AI Chat

  // AI Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Initialize active tab based on current path
  useEffect(() => {
    const currentNav = sidebarConfig.navigation.find(
      item => item.path === location.pathname
    );
    if (currentNav) {
      setActiveTab(currentNav.name);
    }
  }, [location.pathname]);

  const handleNavigate = (path: string) => {
    // Set loading state
    setLoadingTab(path);
    
    // Navigate after a short delay to show loading state
    setTimeout(() => {
      history.push(path); // v5 uses history.push
      setLoadingTab(null);
    }, 300);
  };

  const handleNotificationClick = () => {
    console.log('Notifications clicked');
    // Implement your notification logic here
    // Example: Open notification panel or navigate to notifications page
    setNotificationCount(0);
  };

  const handleAIAssistantClick = () => {
    console.log('AI Assistant clicked');
    setIsAIAssistantOpen(true); // Open AI assistant
  };

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // TODO: Replace with your AI API call
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I received: "${message}". This is a demo response. Connect me to your AI service!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
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
    // Storage handlers for persistence
    onStorageSet: (key: string, value: string) => {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    },
    onStorageGet: (key: string) => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error('Failed to read from localStorage:', e);
        return null;
      }
    },
  };

  const accountDrawerProps = {
    // Customize with your actual user data
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    userAvatar: '/path/to/avatar.png',
    // Add more user-specific props as needed
  };

  return (
    <>
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

      {/* AI Assistant Chat */}
      <AIChatBox
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onMinimize={() => setIsMinimized(!isMinimized)}
        onSendMessage={handleSendMessage}
        messages={messages}
        isLoading={isLoading}
        isMinimized={isMinimized}
        title="AI Assistant"
        placeholder="Ask me anything..."
        position="bottom-left"
      />
    </>
  );
};
```

### 6.2 Create Page Header Component

Create `src/components/PageHeader.tsx` for consistent page headers:

```typescript
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  actions,
  children 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            {title}
          </h1>
          {description && (
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
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
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PageContainer, Button, Card } from '@company/core-ui';
import { PageHeader } from './components/PageHeader';

// Example page components
const HomePage: React.FC = () => (
  <PageContainer>
    <PageHeader 
      title="Home" 
      description="Welcome to your application"
      actions={
        <Button variant="primary">
          Create New
        </Button>
      }
    />
    <div className="space-y-4">
      <Card>
        <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Your application is set up with the @company/core-ui design system.
        </p>
      </Card>
    </div>
  </PageContainer>
);

const DashboardPage: React.FC = () => (
  <PageContainer>
    <PageHeader 
      title="Dashboard" 
      description="Analytics and metrics overview"
    />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <h3 className="text-lg font-semibold mb-2">Total Users</h3>
        <p className="text-3xl font-bold text-primary-600">1,234</p>
        <p className="text-sm text-neutral-500 mt-1">+12% from last month</p>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold mb-2">Active Projects</h3>
        <p className="text-3xl font-bold text-success-600">89</p>
        <p className="text-sm text-neutral-500 mt-1">+5% from last month</p>
      </Card>
      <Card>
        <h3 className="text-lg font-semibold mb-2">Completion Rate</h3>
        <p className="text-3xl font-bold text-warning-600">92%</p>
        <p className="text-sm text-neutral-500 mt-1">+2% from last month</p>
      </Card>
    </div>
  </PageContainer>
);

const ProjectsPage: React.FC = () => (
  <PageContainer>
    <PageHeader title="Projects" description="Manage your projects" />
    <div className="space-y-4">
      {/* Your projects content */}
      <p>Projects page content goes here...</p>
    </div>
  </PageContainer>
);

const ComponentsPage: React.FC = () => (
  <PageContainer>
    <PageHeader title="Components" description="Design system showcase" />
    <div className="space-y-8">
      {/* Component examples */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Buttons</h2>
        <div className="flex gap-4 flex-wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </section>
    </div>
  </PageContainer>
);

const DocumentsPage: React.FC = () => (
  <PageContainer>
    <PageHeader title="Documents" description="Document management" />
    <div className="space-y-4">
      <p>Documents page content goes here...</p>
    </div>
  </PageContainer>
);

const TeamPage: React.FC = () => (
  <PageContainer>
    <PageHeader title="Team" description="Team members and roles" />
    <div className="space-y-4">
      <p>Team page content goes here...</p>
    </div>
  </PageContainer>
);

const SettingsPage: React.FC = () => (
  <PageContainer>
    <PageHeader title="Settings" description="Application settings" />
    <div className="space-y-4">
      <p>Settings page content goes here...</p>
    </div>
  </PageContainer>
);

// 404 Page
const NotFoundPage: React.FC = () => (
  <PageContainer>
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
        404
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        Page not found
      </p>
      <Button variant="primary" onClick={() => window.location.href = '/'}>
        Go to Home
      </Button>
    </div>
  </PageContainer>
);

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/projects" component={ProjectsPage} />
          <Route path="/components" component={ComponentsPage} />
          <Route path="/documents" component={DocumentsPage} />
          <Route path="/team" component={TeamPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/404" component={NotFoundPage} />
          <Redirect to="/404" />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
```

### 7.2 Update index.tsx for React 16.14.0

Update `src/index.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker'; // If using CRA

// Initialize theme before React renders
const initTheme = () => {
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    console.error('Failed to initialize theme:', e);
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

// If using Create React App
serviceWorker.unregister();
```

## Step 8: TypeScript Configuration (if using TypeScript)

### 8.1 Update tsconfig.json

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "es2015", "es2017"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react",
    "baseUrl": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

## Step 9: Environment-Specific Configuration

### 9.1 Create Environment Variables (Optional)

Create `.env` file for environment-specific settings:

```bash
REACT_APP_API_URL=https://api.yourcompany.com
REACT_APP_APP_NAME=Your App Name
REACT_APP_VERSION=$npm_package_version
```

### 9.2 Use Environment Variables in Config

Update `src/config/sidebar.config.tsx` to use environment variables:

```typescript
export const sidebarConfig: SidebarConfig = {
  app: {
    name: process.env.REACT_APP_APP_NAME || 'Your App Name',
    logoSrc: '/app-logos/your-logo.svg',
    homeUrl: '/'
  },
  // ... rest of config
};
```

## Step 10: Clean Up and Run

### 10.1 Remove Unused Files

Remove files that are no longer needed:
- `src/App.css` (if using only Tailwind)
- `src/logo.svg` (if not using)

### 10.2 Run Your App

```bash
npm start
```

## Using Design System Components

### Available Components

```typescript
import { 
  // Layout Components
  AppLayout,
  PageContainer,
  Card,
  Sidebar,
  AccountDrawer,
  
  // Form Components
  Button,
  Input,
  
  // Feedback Components
  Badge,
  Spinner,
  Tooltip,
  InfoBanner,
  CriticalBanner,
  NotificationBadge,
  
  // Filter Components
  DropdownSelect,
  DropdownMultiSelect,
  DateRangeFilter,
  CheckboxFilter,
  ClearAllFilters,
  
  // Modals Components
  AIChatBox,
  
  // Data Display
  TableView,
  ListView,
  
  // Controls
  TableToggle,
  
  // Types
  type Message
} from '@company/core-ui';
```

### Example Component Usage

```typescript
// Buttons
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

// Badges
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>

// Cards
<Card className="p-6">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// Inputs
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Tooltips
<Tooltip content="Helpful information">
  <Button>Hover me</Button>
</Tooltip>
```

## Testing Your Integration

### 1. Visual Check
- ✅ Sidebar appears on the left with navigation items
- ✅ App switcher icon is visible and functional
- ✅ Dark mode toggle works
- ✅ All navigation links work correctly
- ✅ Page layouts are consistent

### 2. Functionality Check
- ✅ Sidebar expands and collapses
- ✅ App switcher shows configured apps
- ✅ Notifications badge shows count
- ✅ AI Assistant button is clickable
- ✅ Theme persists on refresh

### 3. Responsive Check
- ✅ Layout adapts to different screen sizes
- ✅ Components remain functional on mobile

## Performance Optimization

### 1. Code Splitting (React 16.14.0 compatible)

```typescript
import React, { lazy, Suspense } from 'react';
import { Spinner } from '@company/core-ui';

const LazyComponent = lazy(() => import('./components/HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 2. Memoization

```typescript
import React, { memo, useMemo, useCallback } from 'react';

const MemoizedComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => item.value);
  }, [data]);
  
  return <div>{/* Component content */}</div>;
});
```

## Troubleshooting

### Common Issues

1. **CSS not loading properly**
   - Ensure `@import '@company/core-ui/styles'` is at the top of index.css
   - Check that PostCSS is configured correctly

2. **Icons not showing**
   - Verify icon files exist in `public/icons/`
   - Check browser console for 404 errors

3. **TypeScript errors**
   - Run `npm install -D @types/react@^16.14.0 @types/react-dom@^16.14.0`
   - Add `"skipLibCheck": true` to tsconfig.json

4. **Dark mode not working**
   - Ensure theme initialization runs before React renders
   - Check that `dark` class is added to `<html>` element

## Implementing AI Assistant

The design system includes an `AIChatBox` component that provides a ready-to-use AI chat interface. Here's how to implement it:

### Option 1: Integrated in Layout (Recommended)

The Layout component example above already includes the AI Assistant integration. When you click the AI Assistant button in the sidebar, it will open the chat interface.

### Option 2: Standalone Component

If you prefer to manage the AI Assistant separately, create a dedicated component:

```typescript
// src/components/AIAssistant.tsx
import React, { useState } from 'react';
import { AIChatBox, type Message } from '@company/core-ui';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // TODO: Replace with your actual AI API call
    try {
      // Example API call:
      // const response = await fetch('/api/ai/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message })
      // });
      // const data = await response.json();
      
      // Simulated response for demo
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: `I received: "${message}". Connect me to your AI service for real responses!`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('AI chat error:', error);
      setIsLoading(false);
    }
  };

  return (
    <AIChatBox
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={() => setIsMinimized(!isMinimized)}
      onSendMessage={handleSendMessage}
      messages={messages}
      isLoading={isLoading}
      isMinimized={isMinimized}
      title="AI Assistant"
      subtitle="Powered by your AI service"
      placeholder="Type your message..."
      position="bottom-left"
      width="w-[600px]"
      height="h-[500px]"
    />
  );
};
```

Then use it in your app:

```typescript
// In your main component or layout
const [isAIOpen, setIsAIOpen] = useState(false);

// In your JSX
<AIAssistant 
  isOpen={isAIOpen}
  onClose={() => setIsAIOpen(false)}
/>
```

### AIChatBox Props

The `AIChatBox` component accepts these props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Controls visibility of the chat |
| `onClose` | `() => void` | - | Called when close button is clicked |
| `onMinimize` | `() => void` | - | Called when minimize button is clicked |
| `onSendMessage` | `(message: string) => void` | - | Called when user sends a message |
| `messages` | `Message[]` | `[]` | Array of chat messages |
| `isLoading` | `boolean` | `false` | Shows loading indicator |
| `isMinimized` | `boolean` | `false` | Minimized state |
| `title` | `string` | `"IRIS"` | Chat window title |
| `subtitle` | `string` | - | Optional subtitle |
| `placeholder` | `string` | `"Type your message..."` | Input placeholder |
| `position` | `'bottom-left' \| 'bottom-right' \| 'center'` | `'bottom-left'` | Window position |
| `width` | `string` | `'w-[600px]'` | Tailwind width class |
| `height` | `string` | `'h-[420px]'` | Tailwind height class |

### Message Type

```typescript
interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}
```

### Connecting to Your AI Service

To connect the AI Assistant to your actual AI service:

1. Replace the `setTimeout` demo code with your API call
2. Handle errors appropriately
3. Consider adding features like:
   - Message history persistence
   - Typing indicators
   - File uploads
   - Quick actions/suggestions
   - Context awareness

Example with a real API:

```typescript
const handleSendMessage = async (message: string) => {
  // Add user message
  const userMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    content: message,
    timestamp: new Date()
  };
  
  setMessages(prev => [...prev, userMessage]);
  setIsLoading(true);

  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // If needed
      },
      body: JSON.stringify({ 
        message,
        context: messages.slice(-10), // Last 10 messages for context
        userId: currentUser.id
      })
    });

    if (!response.ok) throw new Error('AI service error');

    const data = await response.json();
    
    const aiResponse: Message = {
      id: data.id || (Date.now() + 1).toString(),
      type: 'ai',
      content: data.content,
      timestamp: new Date(data.timestamp || Date.now())
    };
    
    setMessages(prev => [...prev, aiResponse]);
  } catch (error) {
    console.error('AI chat error:', error);
    // Show error message to user
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};
```

## Next Steps

1. **Customize the sidebar** - Update `sidebar.config.tsx` with your app's navigation
2. **Add your branding** - Replace logos and update color scheme
3. **Implement features** - Add real functionality to placeholder pages
4. **Connect to backend** - Integrate with your API endpoints
5. **Add authentication** - Implement user authentication flow

## Support

For issues specific to React 16.14.0:
1. This version has full compatibility with the design system
2. All features should work without modifications
3. Contact the design system team for any integration issues
