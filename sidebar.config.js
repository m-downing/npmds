// @ts-check
import { 
  HomeIcon, 
  ChartBarIcon, 
  CogIcon,
  DocumentTextIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

/**
 * Sidebar configuration
 * Customize this file to configure your app's sidebar
 * 
 * @type {import('@company/design-system').SidebarConfig}
 * @see https://your-docs-url.com/sidebar-configuration
 */
export const sidebarConfig = {
  // Main app configuration
  app: {
    name: 'Your App Name',
    logoSrc: '/logo.svg', // Can also use a React component
    homeUrl: '/'
  },
  
  // Navigation items in the sidebar
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
      // Uncomment and customize for your apps
      // { 
      //   name: 'IPSC App 1', 
      //   logoSrc: '/icons/app1.svg', 
      //   href: '#' 
      // },
      // { 
      //   name: 'IPSC App 2', 
      //   logoSrc: '/icons/app2.svg', 
      //   href: '#' 
      // },
      // { 
      //   name: 'IPSC App 3', 
      //   logoSrc: BeakerIcon, // Can use React components
      //   href: '#' 
      // },
      // { 
      //   name: 'IPSC App 4', 
      //   logoSrc: BoltIcon, // Can use React components
      //   href: '#' 
      // }
    ]
  },
  
  // AI Assistant configuration (optional)
  aiAssistant: {
    enabled: true,
    name: 'AI Assistant',
    placeholder: 'Ask me anything...'
    // icon: CustomAIIcon // Optional: provide custom icon
  }
}; 