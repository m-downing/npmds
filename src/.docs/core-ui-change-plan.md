# Core UI Framework-Agnostic Refactoring Plan

## 🎯 **Objective**
Transform the current design system into a truly framework-agnostic core UI package by removing React-specific dependencies and eliminating opinionated business logic. Since the design system already uses Tailwind's `dark:` utility classes with custom tokens, **no theme props are needed** - Tailwind will handle theming automatically when consuming apps toggle the `dark` class.

## 📋 **Priority Order**

### **Phase 1: Foundation & Token System** ✅ (Already Complete)
- `src/foundations/tokens/` - No changes needed
- `src/styles/` - No changes needed  
- `tailwind.config.js` & `tailwind.preset.js` - No changes needed

### **Phase 2: Package Configuration** ✅ (Complete)
- `package.json` - Updated to @company/core-ui v2.0.0
- `rollup.config.js` - Simplified to single entry point
- Removed framework-specific exports and dependencies

### **Phase 3: Core Components** (HIGH PRIORITY)
- `src/components/primitives/`
- `src/components/forms/`
- `src/components/feedback/`
- `src/components/filters/`
- `src/components/controls/`

### **Phase 4: Layout Components** (HIGH PRIORITY)
- `src/layout/Card.tsx` ✅ (Already framework-agnostic)
- `src/layout/PageContainer.tsx` ✅ (Already framework-agnostic)
- `src/layout/Sidebar.tsx`
- `src/layout/AppWrapper.tsx`

### **Phase 5: Tabular Data Components** (MEDIUM PRIORITY)
- `src/tabularData/TableView.tsx` - **No Recharts dependency** ✅
- `src/tabularData/ListView.tsx` - **No Recharts dependency** ✅
- `src/tabularData/utils.ts`

### **Phase 6: Business Components** (LOW PRIORITY - Consider Removal)
- `src/layout/AccountDrawer.tsx`
- `src/layout/MainLoadingScreen/`

---

## 🔧 **Phase 3: Core Components Refactoring**

### **3.1 Primitives (`src/components/primitives/`)**

#### **Button.tsx**
```typescript
// REMOVE:
- 'use client' directive
- useTheme() hook
- useEffect for mounting state

// KEEP:
- Existing Tailwind classes with dark: modifiers
- All other props and functionality

// REMOVE:
const { theme } = useTheme();
const isDark = theme === 'dark';

// REMOVE:
const [isMounted, setIsMounted] = useState(false);
useEffect(() => setIsMounted(true), []);

// SIMPLIFY:
Return JSX directly without mounting checks or theme logic
```

#### **types.ts**
```typescript
// NO CHANGES NEEDED:
- Keep existing prop interfaces as-is
- No theme props needed since Tailwind handles theming
```

### **3.2 Forms (`src/components/forms/`)**

#### **Input.tsx**
```typescript
// REMOVE:
- 'use client' directive (if present)
- Any useTheme() hooks

// KEEP:
- Existing Tailwind classes with dark: modifiers
- All existing props and functionality
```

### **3.3 Feedback (`src/components/feedback/`)**

#### **All Feedback Components (Badge, Spinner, Tooltip, NotificationBadge, Banners)**
```typescript
// REMOVE:
- 'use client' directive
- useTheme() hook

// KEEP:
- Existing Tailwind classes with dark: modifiers
- All existing props and functionality
- No interface changes needed
```

### **3.4 Filters (`src/components/filters/`)**

#### **All Filter Components**
```typescript
// REMOVE:
- 'use client' directive
- useTheme() hook

// KEEP:
- Existing Tailwind classes with dark: modifiers
- All existing props and functionality
- No interface changes needed
```

### **3.5 Controls (`src/components/controls/`)**

#### **TableToggle.tsx**
```typescript
// REMOVE:
- 'use client' directive
- useTheme() hook

// KEEP:
- Existing Tailwind classes with dark: modifiers
- All existing props and functionality
```

---

## 🏗️ **Phase 4: Layout Components Refactoring**

### **4.1 Sidebar.tsx** (MAJOR REFACTOR)

#### **Remove Dependencies**
```typescript
// REMOVE:
- 'use client' directive
- useNavigation() hook
- useTheme() hook
- useNotifications() hook
- localStorage direct access

// REMOVE IMPORTS:
- import { useNavigation } from '../navigation';
- import { useTheme } from '../contexts/ThemeContext';
- import { useNotifications } from '../contexts/NotificationContext';
```

#### **Update Props Interface**
```typescript
interface SidebarProps {
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  config: SidebarConfig;
  
  // Framework-agnostic navigation
  currentPath?: string;
  onNavigate?: (path: string) => void;
  
  // Business logic (optional)
  notificationCount?: number;
  onNotificationClick?: () => void;
  onAIAssistantClick?: () => void;
  
  // State management (optional)
  activeTab?: string;
  onActiveTabChange?: (tab: string) => void;
  
  // Storage callbacks (optional)
  onStorageSet?: (key: string, value: string) => void;
  onStorageGet?: (key: string) => string | null;
}
```

#### **Replace Hook Usage**
```typescript
// REPLACE:
const { currentPath, navigate } = useNavigation();
// WITH:
const { currentPath, onNavigate } = props;

// REMOVE:
const { theme } = useTheme();
const isDark = theme === 'dark';
// (Tailwind dark: classes handle theming automatically)

// REPLACE:
const { unreadCount } = useNotifications();
// WITH:
const { notificationCount = 0 } = props;

// REPLACE:
localStorage.setItem('activeTab_hyperion', tabName);
// WITH:
onStorageSet?.('activeTab_hyperion', tabName);

// REPLACE:
const savedTab = localStorage.getItem('activeTab_hyperion');
// WITH:
const savedTab = onStorageGet?.('activeTab_hyperion');
```

#### **Update Navigation Logic**
```typescript
// REPLACE:
navigate(tabPath);
// WITH:
onNavigate?.(tabPath);
```

### **4.2 AppWrapper.tsx** (MAJOR REFACTOR)

#### **Simplify to AppLayout**
```typescript
// RENAME: AppWrapper.tsx → AppLayout.tsx

// REMOVE:
- 'use client' directive
- Context providers (ThemeProvider, NotificationProvider)
- Theme initialization logic
- Business banners
- useNavigation() hook

// KEEP:
- Grid layout structure
- Loading state handling
- Children rendering
```

#### **New Props Interface**
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
  
  // Sidebar props
  sidebarProps: SidebarProps;
  
  // Optional features
  showBanners?: boolean;
  bannerContent?: React.ReactNode;
  isLoading?: boolean;
  loadingComponent?: React.ReactNode;
  
  // Optional account drawer
  accountDrawerProps?: AccountDrawerProps;
  showAccountDrawer?: boolean;
}
```

#### **Simplified Component**
```typescript
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  sidebarProps,
  showBanners = false,
  bannerContent,
  isLoading = false,
  loadingComponent,
  accountDrawerProps,
  showAccountDrawer = false,
}) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  
  return (
    <div className={`grid ${isSidebarExpanded ? 'grid-cols-[180px_1fr]' : 'grid-cols-[64px_1fr]'} min-h-screen`}>
      {showAccountDrawer && <AccountDrawer {...accountDrawerProps} />}
      
      <Sidebar 
        {...sidebarProps}
        isExpanded={isSidebarExpanded}
        onExpandedChange={setIsSidebarExpanded}
      />
      
      <main className="overflow-y-auto min-h-screen">
        {showBanners && bannerContent}
        {isLoading && (loadingComponent || <DefaultLoadingSpinner />)}
        {!isLoading && children}
      </main>
    </div>
  );
};
```

---

## 📊 **Phase 5: Tabular Data Components** ✅ (No Recharts Dependencies)

### **5.1 TableView.tsx** (SIMPLE REFACTOR)

#### **Remove Dependencies**
```typescript
// REMOVE:
- 'use client' directive
- useTheme() hook

// REMOVE IMPORTS:
- import { useTheme } from '../contexts/ThemeContext';

// NOTE: No Recharts dependencies found ✅
// Components use native HTML tables with @heroicons/react
```

#### **Replace Theme Context Usage**
```typescript
// REMOVE:
const { theme } = useTheme();
const isDark = theme === 'dark';

// REPLACE INLINE STYLES WITH TAILWIND:
// Components already use appropriate Tailwind classes
// Just need to remove the theme logic, keep existing classes
```

#### **Keep Business Features**
```typescript
// KEEP:
- All existing table functionality
- Mode toggle (summary/drilldown/deepDive)
- Pagination, sorting, filtering
- Column resizing and reordering
- External navigation callbacks

// MAKE OPTIONAL:
- External navigation (already callback-based)
- Mode toggle (already optional)
```

### **5.2 ListView.tsx** (SIMPLE REFACTOR)

#### **Apply Same Pattern**
```typescript
// Follow same pattern as TableView:
- Remove 'use client' and useTheme()
- Keep existing Tailwind classes with dark: modifiers
- Keep all existing functionality
- No major interface changes needed
```

### **5.3 utils.ts** (MINOR UPDATES)

#### **Keep External Navigation Generic**
```typescript
// KEEP:
- All existing utility functions
- External navigation is already callback-based via openTableInNewTab
- No major changes needed

// OPTIONAL ENHANCEMENT:
// Could make sessionStorage usage optional with callbacks
```

---

## 🗑️ **Phase 6: Business Components (Consider Removal)**

### **6.1 AccountDrawer.tsx**
```typescript
// DECISION: Keep but make optional
// REFACTOR: Remove useTheme(), keep Tailwind dark: classes
// USAGE: Only include if showAccountDrawer={true}
```

### **6.2 MainLoadingScreen/**
```typescript
// DECISION: Simplify to basic loading component
// REFACTOR: Remove complex animations, keep Tailwind dark: classes
// RENAME: LoadingSpinner.tsx
```

---

## 📦 **Package Configuration** ✅ (Complete)

### **package.json Updates** ✅
```json
{
  "name": "@company/core-ui",
  "version": "2.0.0",
  "description": "Framework-agnostic core UI design system",
  "peerDependencies": {
    "react": "^16.14.0 || ^17.0.0 || ^18.0.0",
    "react-dom": "^16.14.0 || ^17.0.0 || ^18.0.0",
    "@heroicons/react": "^2.0.0"
  }
}
```

### **rollup.config.js Updates** ✅
```javascript
// Single entry point build
// Removed framework-specific exports
// Simplified external dependencies
// No longer copying removed directories
```

---

## 🧪 **Testing Strategy**

### **Create Test Components**
```typescript
// Create test components that use the refactored components
// Test both light and dark themes by toggling 'dark' class
// Test with and without optional features
// Test callback functionality
```

### **Migration Examples**
```typescript
// Before (with hooks)
const MyComponent = () => {
  const { theme } = useTheme();
  return <Button>Click me</Button>;
};

// After (framework-agnostic)
const MyComponent = () => {
  // Theme handled automatically by Tailwind dark: classes
  return <Button>Click me</Button>;
};
```

---

## 🚀 **Implementation Order**

1. **✅ Phase 1 & 2** - Foundation and package configuration (Complete)
2. **🔄 Phase 3** - Core components (primitives, forms, feedback, filters, controls)
3. **🔄 Phase 4** - Layout components (Sidebar, AppWrapper)
4. **🔄 Phase 5** - Tabular data components (simple refactor)
5. **🔄 Phase 6** - Business components (decide on removal)

### **Per-Component Checklist**
- [ ] Remove 'use client' directive
- [ ] Remove useTheme() hook
- [ ] Keep existing Tailwind classes with dark: modifiers
- [ ] Remove other React-specific hooks
- [ ] Add callback props for external dependencies
- [ ] Test light and dark themes (by toggling 'dark' class on html)
- [ ] Update exports in index.ts

---

## 📋 **Success Criteria**

### **Framework Agnostic**
- [ ] No 'use client' directives
- [ ] No React-specific hooks (useTheme, useNavigation, etc.)
- [ ] No context dependencies
- [ ] No localStorage direct access

### **Theme Agnostic**
- [ ] Components use Tailwind dark: classes (no theme props needed)
- [ ] Light theme works by default
- [ ] Dark theme works when 'dark' class is on html element
- [ ] Consuming apps control theme by toggling 'dark' class

### **Business Logic Agnostic**
- [ ] All business features are optional
- [ ] External navigation is callback-based
- [ ] Storage operations are callback-based
- [ ] No hardcoded business assumptions

### **Fully Functional**
- [ ] All existing functionality preserved
- [ ] Performance maintained
- [ ] Accessibility maintained
- [ ] TypeScript support complete

---

## 🎯 **Final Package Structure**

```
@company/core-ui/
├── foundations/           ✅ No changes needed
├── components/
│   ├── primitives/       🔄 Remove hooks, keep Tailwind classes
│   ├── forms/           🔄 Remove hooks, keep Tailwind classes
│   ├── feedback/        🔄 Remove hooks, keep Tailwind classes
│   ├── filters/         🔄 Remove hooks, keep Tailwind classes
│   └── controls/        🔄 Remove hooks, keep Tailwind classes
├── layout/
│   ├── Card.tsx         ✅ Already framework-agnostic
│   ├── PageContainer.tsx ✅ Already framework-agnostic
│   ├── Sidebar.tsx      🔄 Major refactor - remove hooks
│   └── AppLayout.tsx    🔄 Simplified AppWrapper
├── tabularData/
│   ├── TableView.tsx    🔄 Simple refactor - remove useTheme
│   ├── ListView.tsx     🔄 Simple refactor - remove useTheme
│   └── utils.ts         ✅ Minimal changes needed
└── styles/              ✅ No changes needed
```

This plan will result in a truly framework-agnostic core UI package that maintains all the power and flexibility of the original design system while being usable across different frameworks and applications.

## 🎨 **Theme Management for Consuming Apps**

Since components use Tailwind's `dark:` classes, consuming apps just need to manage the `dark` class on the HTML element:

### **React Example**
```typescript
const useTheme = () => {
  const [isDark, setIsDark] = useState(false);
  
  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };
  
  useEffect(() => {
    // Initialize from localStorage or system preference
    const saved = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved === 'dark' || (!saved && systemDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);
  
  return { isDark, toggleTheme };
};

// Components automatically respond to dark class
const App = () => {
  const { toggleTheme } = useTheme();
  
  return (
    <div>
      <Button>Auto-themed button!</Button>
      <Sidebar config={config} />
      <TableView data={data} columns={columns} />
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

### **Vue Example**
```typescript
const useTheme = () => {
  const isDark = ref(false);
  
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle('dark');
  };
  
  return { isDark, toggleTheme };
};
```

### **Next.js Example with next-themes**
```typescript
import { ThemeProvider } from 'next-themes';

// App automatically handles dark class
<ThemeProvider attribute="class">
  <Button>Auto-themed!</Button>
</ThemeProvider>
```
