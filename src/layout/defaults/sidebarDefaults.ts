import { ChartBarSquareIcon, HomeIcon, CogIcon, DocumentTextIcon, UserGroupIcon, ChartPieIcon, FolderIcon } from '@heroicons/react/24/outline';
import { SparklesIcon, BeakerIcon, BoltIcon, FireIcon, GlobeAltIcon, RocketLaunchIcon } from '@heroicons/react/24/solid';
import type { SidebarConfig } from '../types';

export const defaultSidebarConfig: SidebarConfig = {
  app: {
    name: 'IPSC App',
    logoSrc: '/icons/ui/flow.svg',
    homeUrl: '/'
  },
  appSwitcher: {
    enabled: true,
    apps: [
      {
        name: 'IPSC App 1',
        logoSrc: BeakerIcon,
        href: '#'
      },
      {
        name: 'IPSC App 2',
        logoSrc: BoltIcon,
        href: '#'
      },
      {
        name: 'IPSC App 3',
        logoSrc: FireIcon,
        href: '#'
      },
      {
        name: 'IPSC App 4',
        logoSrc: GlobeAltIcon,
        href: '#'
      }
    ]
  },
  navigation: [
    {
      name: 'App Tab 1',
      icon: HomeIcon,
      path: '/app-tab-1'
    },
    {
      name: 'App Tab 2',
      icon: ChartBarSquareIcon,
      path: '/app-tab-2'
    },
    {
      name: 'App Tab 3',
      icon: DocumentTextIcon,
      path: '/app-tab-3'
    },
    {
      name: 'App Tab 4',
      icon: UserGroupIcon,
      path: '/app-tab-4'
    },
    {
      name: 'App Tab 5',
      icon: ChartPieIcon,
      path: '/app-tab-5'
    },
    {
      name: 'App Tab 6',
      icon: CogIcon,
      path: '/app-tab-6'
    },
    {
      name: 'App Tab 7',
      icon: FolderIcon,
      path: '/app-tab-7'
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
};
