import { ComponentType } from 'react';

// Main configuration interface
export interface SidebarConfig {
  app: AppConfig;
  appSwitcher?: AppSwitcherConfig;
  navigation: NavigationTab[];
  aiAssistant?: AIAssistantConfig;
  notifications?: NotificationsConfig;
}

// App branding configuration
export interface AppConfig {
  name: string;
  logoSrc: string | ComponentType<any>;
  homeUrl: string;
}

// App switcher configuration
export interface AppSwitcherConfig {
  enabled: boolean;
  apps: AppSwitcherItem[];
}

export interface AppSwitcherItem {
  name: string;
  logoSrc: string | ComponentType<any>;
  href: string;
}

// Navigation tab configuration
export interface NavigationTab {
  name: string;
  path: string;
  icon: string | ComponentType<any>;
}

// AI Assistant configuration
export interface AIAssistantConfig {
  enabled: boolean;
  name: string;
  placeholder?: string;
  icon?: ComponentType<any>;
}

// Notifications configuration
export interface NotificationsConfig {
  enabled: boolean;
}
