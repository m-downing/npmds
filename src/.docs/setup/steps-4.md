# @company/core-ui Integration Guide - Next.js 15.2.2 + App Router + TypeScript

This guide walks through integrating the @company/core-ui design system into a Next.js 15.2.2 app using the App Router and TypeScript.

## Prerequisites

Your app should have these dependencies:
```json
{
  "next": "^15.2.2",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.4.1"  // ⚠️ v4 is NOT supported yet
}
```

> **⚠️ Tailwind CSS Version**: This design system requires Tailwind CSS v3.x. Tailwind CSS v4 introduces breaking changes and is not yet supported. Make sure to use `tailwindcss@^3.4.1`.

## Step 1: Install the Design System

```bash
# From local package (during development)
npm install /path/to/company-core-ui-2.0.0.tgz

# Or from npm registry (once published)
npm install @company/core-ui
```

### Install Additional Dependencies

```bash
npm install @heroicons/react@^2.0.18 clsx@^2.0.0

# Also install PostCSS module for Next.js 15 compatibility
npm install -D @tailwindcss/postcss postcss-nested
```

## Step 2: Configure PostCSS and Tailwind CSS

### 2.1 Update postcss.config.js (for Next.js 15)

Make sure your PostCSS config uses CommonJS format:

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 2.2 Install Tailwind CSS (if not already installed)

```bash
# IMPORTANT: Use Tailwind CSS v3.x - v4 is not yet supported
npm install -D tailwindcss@^3.4.1 postcss autoprefixer
npx tailwindcss init -p
```

⚠️ **Important**: The design system requires Tailwind CSS v3.x. If you have Tailwind CSS v4 installed, you'll need to downgrade:

```bash
# Remove Tailwind v4
npm uninstall tailwindcss

# Install compatible version
npm install -D tailwindcss@^3.4.1
```

### 2.3 Update tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@company/core-ui/dist/**/*.{js,cjs}'
  ],
  presets: [require('@company/core-ui/tailwind.preset')], // Use require() for CommonJS module
  darkMode: 'class',
  theme: {
    extend: {
      // Your custom theme extensions
    }
  },
  plugins: []
}

export default config
```

**Note**: The preset must be imported using `require()` because it's exported as a CommonJS module.

## Step 3: Update Global CSS

### 3.1 Update app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import design system styles */
@import '@company/core-ui/styles';

/* Your custom styles below */
```

## Step 4: Create Required Assets

### 4.1 Create the public directory structure

```bash
mkdir -p public/icons/ui
mkdir -p public/icons/vertical-nav
```

### 4.2 Add required SVG icons

Create `public/icons/ui/flow.svg`:
```svg
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 4L6 14V34L24 44L42 34V14L24 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M24 44V24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M42 14L24 24L6 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M6 34L24 24L42 34" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

Create `public/icons/vertical-nav/app-switcher.svg`:
```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="3" y="3" width="8" height="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="13" y="3" width="8" height="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="3" y="13" width="8" height="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="13" y="13" width="8" height="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

## Step 5: Create Sidebar Configuration

### 5.1 Create app/config/sidebar.config.ts

```typescript
import { SidebarConfig } from '@company/core-ui'
import { 
  HomeIcon, 
  ChartBarSquareIcon, 
  DocumentTextIcon, 
  UserGroupIcon,
  CogIcon,
  FolderIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline'
import { 
  SparklesIcon, 
  BeakerIcon, 
  BoltIcon, 
  FireIcon, 
  GlobeAltIcon 
} from '@heroicons/react/24/solid'

export const sidebarConfig: SidebarConfig = {
  app: {
    name: 'My App',
    logoSrc: '/icons/ui/flow.svg',
    homeUrl: '/'
  },
  appSwitcher: {
    enabled: true,
    apps: [
      {
        name: 'App 1',
        logoSrc: BeakerIcon,
        href: '#'
      },
      {
        name: 'App 2',
        logoSrc: BoltIcon,
        href: '#'
      },
      {
        name: 'App 3',
        logoSrc: FireIcon,
        href: '#'
      },
      {
        name: 'App 4',
        logoSrc: GlobeAltIcon,
        href: '#'
      }
    ]
  },
  navigation: [
    {
      name: 'Dashboard',
      icon: HomeIcon,
      path: '/'
    },
    {
      name: 'Analytics',
      icon: ChartBarSquareIcon,
      path: '/analytics'
    },
    {
      name: 'Documents',
      icon: DocumentTextIcon,
      path: '/documents'
    },
    {
      name: 'Team',
      icon: UserGroupIcon,
      path: '/team'
    },
    {
      name: 'Reports',
      icon: ChartPieIcon,
      path: '/reports'
    },
    {
      name: 'Projects',
      icon: FolderIcon,
      path: '/projects'
    },
    {
      name: 'Settings',
      icon: CogIcon,
      path: '/settings'
    }
  ],
  aiAssistant: {
    enabled: true,
    name: 'AI Assistant',
    placeholder: 'Ask me anything...',
    icon: SparklesIcon
  },
  notifications: {
    enabled: true
  }
}
```

## Step 6: Create Layout Component

### 6.1 Create app/components/LayoutWrapper.tsx

```typescript
'use client'

import { AppLayout } from '@company/core-ui'
import { usePathname, useRouter } from 'next/navigation'
import { sidebarConfig } from '../config/sidebar.config' // Use relative import
import { useState } from 'react'

interface LayoutWrapperProps {
  children: React.ReactNode
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  const sidebarProps = {
    isExpanded: isSidebarExpanded,
    onExpandedChange: setIsSidebarExpanded,
    config: sidebarConfig,
    currentPath: pathname,
    notificationCount: 3,
    onNavigate: (path: string) => {
      router.push(path)
    },
    onNotificationClick: () => {
      console.log('Notifications clicked')
    },
    onAIAssistantClick: () => {
      console.log('AI Assistant clicked')
    }
  }

  const accountDrawerProps = {
    userName: "John Doe",
    userEmail: "john.doe@company.com",
    onAccountClick: () => {
      console.log('Account clicked')
    },
    onSignOut: () => {
      console.log('Sign out clicked')
    }
  }

  return (
    <AppLayout
      sidebarProps={sidebarProps}
      accountDrawerProps={accountDrawerProps}
      showAccountDrawer={true}
      showInfoBanner={true}
      showCriticalBanner={false}
    >
      {children}
    </AppLayout>
  )
}
```

**Important Notes**:
- Uses relative imports to avoid path alias issues
- All sidebar-related props go inside a `sidebarProps` object
- Includes `onNavigate` handler for navigation to work
- Manages sidebar expanded state locally

## Step 7: Update Root Layout

### 7.1 Update app/layout.tsx

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LayoutWrapper from './components/LayoutWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with @company/core-ui design system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
```

## Step 8: Create Example Pages

### 8.1 Update app/page.tsx

```typescript
import { Card, Button, Badge, PageContainer } from '@company/core-ui'

export default function HomePage() {
  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-8">
          Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            title="Welcome to Your App"
            subtitle="Built with @company/core-ui design system"
          >
            <div className="space-y-4">
              <p className="text-neutral-600 dark:text-neutral-300">
                This is an example of using the design system components.
              </p>
              
              <div className="flex gap-2">
                <Badge variant="forecast">Active</Badge>
                <Badge variant="critical" icon="exclamation-triangle">
                  Alert
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button variant="primary">
                  Primary Action
                </Button>
                <Button variant="secondary">
                  Secondary
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Add more cards as needed */}
        </div>
      </div>
    </PageContainer>
  )
}
```

### 8.2 Create app/analytics/page.tsx

```typescript
'use client' // Required because TableView uses hooks

import { Card, TableView, PageContainer } from '@company/core-ui'

const sampleData = [
  { id: 1, name: 'Product A', sales: 1234, status: 'Active' },
  { id: 2, name: 'Product B', sales: 5678, status: 'Active' },
  { id: 3, name: 'Product C', sales: 910, status: 'Inactive' },
]

const columns = [
  { id: 'name', header: 'Product Name', accessorKey: 'name' as const },
  { id: 'sales', header: 'Sales', accessorKey: 'sales' as const },
  { id: 'status', header: 'Status', accessorKey: 'status' as const },
]

export default function AnalyticsPage() {
  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-8">
          Analytics
        </h1>
        
        <Card>
          <TableView
            data={sampleData}
            columns={columns}
            title="Product Performance"
            mode="summary"
          />
        </Card>
      </div>
    </PageContainer>
  )
}
```

## Step 9: TypeScript Configuration

### 9.1 Update tsconfig.json (if needed)

Ensure your tsconfig.json includes:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./app/*"],
      "@company/core-ui": ["./node_modules/@company/core-ui/dist/index"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Step 10: Add Dark Mode Support (Optional)

### 10.1 Install next-themes

```bash
npm install next-themes
```

### 10.2 Create app/providers/ThemeProvider.tsx

```typescript
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  )
}
```

### 10.3 Update app/layout.tsx

```typescript
import { ThemeProvider } from './providers/ThemeProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## Common Issues & Solutions

### Issue 1: Tailwind CSS v4 Compatibility

**Problem**: Build errors or styling issues when using Tailwind CSS v4.

**Solution**: The design system requires Tailwind CSS v3.x. Downgrade if necessary:
```bash
npm uninstall tailwindcss
npm install -D tailwindcss@^3.4.1
```

**Common v4 errors you might see**:
- `Error: Cannot find module './src/foundations/tokens/colors.js'`
- Missing styles or broken layouts
- PostCSS configuration errors
- Tailwind config parsing errors

### Issue 2: PostCSS Module Error

**Problem**: `Error: Cannot find module '@tailwindcss/postcss'`

**Solution**: Install the missing PostCSS modules:
```bash
npm install -D @tailwindcss/postcss postcss-nested
```

### Issue 3: Tailwind Classes Not Applied

**Solution**: Ensure the design system's dist folder is included in your Tailwind content array:
```javascript
content: [
  // ... other paths
  './node_modules/@company/core-ui/dist/**/*.{js,cjs}'
]
```

### Issue 4: TypeScript Errors with Imports

**Solution**: Make sure TypeScript can find the types:
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

### Issue 5: Dark Mode Not Working

**Solution**: Ensure you have:
1. `darkMode: 'class'` in tailwind.config.ts
2. ThemeProvider wrapping your app
3. `suppressHydrationWarning` on the html element

### Issue 6: Icons Not Loading

**Solution**: Verify that:
1. Public folder structure is correct
2. SVG files are properly formatted
3. Icon paths in sidebar config match file locations

### Issue 7: Import Path Issues

**Problem**: Errors like `Module not found: Can't resolve '@/app/components/LayoutWrapper'`

**Solution**: Use relative imports instead of path aliases, or ensure your tsconfig.json has the correct path mappings:
```typescript
// Instead of:
import LayoutWrapper from '@/app/components/LayoutWrapper'

// Use:
import LayoutWrapper from './components/LayoutWrapper'
```

### Issue 8: Navigation Not Working

**Problem**: Clicking sidebar links shows loading spinner but doesn't navigate

**Solution**: Make sure your LayoutWrapper includes the `onNavigate` handler:
```typescript
const sidebarProps = {
  // ... other props
  onNavigate: (path: string) => {
    router.push(path)
  }
}
```

### Issue 9: Prerender Error with Interactive Components

**Problem**: `TypeError: (0 , n.useRef) is not a function` during build

**Solution**: Add `'use client'` directive to pages that use interactive components:
```typescript
'use client' // Add this at the top

import { TableView } from '@company/core-ui'
// ... rest of your component
```

This happens because components like `TableView`, `ListView`, and other interactive components use React hooks that aren't available during server-side prerendering.

## Next Steps

1. **Customize the sidebar**: Modify `sidebar.config.ts` to match your app's navigation
2. **Add more pages**: Create additional pages following the pattern shown
3. **Use more components**: Explore all available components from @company/core-ui
4. **Theme customization**: Extend the Tailwind config to customize colors, fonts, etc.

## Available Components

The design system provides these components (all support TypeScript and are App Router compatible):

- **Layout**: AppLayout, Sidebar, Card, PageContainer, AccountDrawer
- **Primitives**: Button
- **Forms**: Input
- **Feedback**: Badge, Spinner, Tooltip, NotificationBadge, CriticalBanner, InfoBanner
- **Filters**: DropdownSelect, DropdownMultiSelect, DateRangeFilter, CheckboxFilter, ClearAllFilters
- **Controls**: TableToggle
- **Modals**: AIChatBox
- **Tabular Data**: TableView, ListView

All components include proper TypeScript types and work seamlessly with Next.js App Router's server and client components.

## Important Notes for App Router

### Server vs Client Components

The design system components are marked with 'use client' directive where necessary. This means:

1. **Server Components** (default in App Router):
   - Can import and render design system components
   - Cannot use event handlers or hooks directly
   - Great for static content and data fetching

2. **Client Components** (with 'use client'):
   - All interactive components from @company/core-ui are client components
   - Can use hooks, event handlers, and browser APIs
   - Required for components with state or interactivity

### Example: Mixing Server and Client Components

```typescript
// app/products/page.tsx - Server Component (no 'use client')
import { Card, PageContainer } from '@company/core-ui'
import { ProductList } from './ProductList'

// This is a Server Component - it can fetch data
async function getProducts() {
  const res = await fetch('https://api.example.com/products')
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()
  
  return (
    <PageContainer>
      <Card title="Products">
        {/* ProductList is a Client Component that handles interactivity */}
        <ProductList products={products} />
      </Card>
    </PageContainer>
  )
}
```

```typescript
// app/products/ProductList.tsx - Client Component
'use client'

import { useState } from 'react'
import { Button, Badge } from '@company/core-ui'

export function ProductList({ products }) {
  const [filter, setFilter] = useState('all')
  
  return (
    <div>
      <Button onClick={() => setFilter('active')}>
        Show Active Only
      </Button>
      {/* Interactive filtering logic here */}
    </div>
  )
}
```

This separation allows you to leverage the benefits of both server and client components while using the design system.

## Implementing AI Assistant

The design system includes an `AIChatBox` component. To implement it:

### Create app/components/AIAssistant.tsx

```typescript
'use client'

import { useState } from 'react'
import { AIChatBox, type Message } from '@company/core-ui'

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
}

export default function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // TODO: Replace with your AI API call
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I received: "${message}". Connect me to your AI service!`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

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
      placeholder="Ask me anything..."
    />
  )
}
```

### Update LayoutWrapper to use it

```typescript
// Add to your imports
import AIAssistant from './AIAssistant'

// Add state in LayoutWrapper
const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)

// Update onAIAssistantClick in sidebarProps
onAIAssistantClick: () => {
  setIsAIAssistantOpen(true)
}

// Add after </AppLayout>
<AIAssistant 
  isOpen={isAIAssistantOpen}
  onClose={() => setIsAIAssistantOpen(false)}
/>
```
