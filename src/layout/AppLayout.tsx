import React, { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';
import { AccountDrawer } from './AccountDrawer';
import MainLoadingSpinner from './MainLoadingScreen';
import { InfoBanner, CriticalBanner } from '../components/feedback';
import type { SidebarConfig } from './types';

interface SidebarProps {
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  config?: SidebarConfig;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
  onAIAssistantClick?: () => void;
  activeTab?: string;
  onActiveTabChange?: (tab: string) => void;
  onStorageSet?: (key: string, value: string) => void;
  onStorageGet?: (key: string) => string | null;
  ImageComponent?: React.ComponentType<any>;
  LinkComponent?: React.ComponentType<any>;
  loadingTab?: string | null;
  onLoadingChange?: (tab: string | null) => void;
}

interface AccountDrawerProps {
  // Add account drawer props as needed
  [key: string]: any;
}

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
  
  // Banner configuration
  showInfoBanner?: boolean;
  showCriticalBanner?: boolean;
  
  // Theme management (optional)
  onThemeInit?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  sidebarProps,
  showBanners = true,
  bannerContent,
  isLoading = false,
  loadingComponent,
  accountDrawerProps,
  showAccountDrawer = true,
  showInfoBanner = true,
  showCriticalBanner = false,
  onThemeInit,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Only initialize on client side
  useEffect(() => {
    setIsClient(true);
    
    // Call theme init callback if provided
    if (onThemeInit) {
      onThemeInit();
    }
  }, [onThemeInit]);

  const DefaultLoadingSpinner = loadingComponent || <MainLoadingSpinner />;

  return (
    <div className={`grid ${isSidebarExpanded ? 'grid-cols-[180px_1fr]' : 'grid-cols-[64px_1fr]'} min-h-screen min-w-[768px] relative bg-white dark:bg-neutral-950`}>
      {/* Account Drawer */}
      {showAccountDrawer && <AccountDrawer {...accountDrawerProps} />}
      
      <Sidebar 
        {...sidebarProps}
        isExpanded={isSidebarExpanded}
        onExpandedChange={setIsSidebarExpanded}
      />
      
      <main className="overflow-y-auto min-h-screen relative bg-neutral-50 dark:bg-neutral-950">
        {/* System Banners */}
        {showBanners && (
          <>
            {/* CriticalBanner - For urgent alerts, maintenance, security issues */}
            <CriticalBanner
              title="This banner cannot be dismissed by the user and will persist on all pages until removed by dev team."
              message={
                <div className="space-y-1">
                  <p><em>Banner visibility is controlled by a const boolean value in the AppLayout component</em></p>
                </div>
              }
              icon={<ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 text-error-500" />}
              isVisible={showCriticalBanner}
            />

            {/* InfoBanner - For feature announcements, tips, non-critical updates */}
            <InfoBanner
              id="flow-redesign"
              title="FLOW v2.0 Design System Demo"
              message={
                <div className="space-y-1">
                  <p><strong>New Features: </strong><em>App Switcher, User Prefs, Dark Mode, Banners, and AI Chat Agent.</em> </p>
                  <p>This InfoBanner can be dismissed and won&apos;t reappear once closed.</p>
                </div>
              }
              action={{
                label: "Explore Features",
                onClick: () => {
                  console.log('Navigate to features overview');
                  alert('Demo: This would navigate to the features overview page');
                }
              }}
              icon={<SparklesIcon className="w-5 h-5 text-primary-700 flex-shrink-0" />}
              isVisible={showInfoBanner}
            />
          </>
        )}
        
        {/* Custom banner content */}
        {bannerContent}

        {/* Main content */}
        {isLoading && DefaultLoadingSpinner}
        {!isLoading && children}
      </main>
    </div>
  );
};

export default AppLayout; 