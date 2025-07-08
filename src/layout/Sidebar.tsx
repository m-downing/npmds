import React, { useState, useEffect, useRef, useCallback, ComponentType } from 'react';
import { ArrowRightStartOnRectangleIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { Spinner } from '../components/feedback';
import Tooltip from '../components/feedback/Tooltip';
import NotificationBadge from '../components/feedback/NotificationBadge';
import type { SidebarConfig } from './types';
import { defaultSidebarConfig } from './defaults/sidebarDefaults';

interface SidebarProps {
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  config?: SidebarConfig;
  
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
  
  // Component providers (optional)
  ImageComponent?: ComponentType<any>;
  LinkComponent?: ComponentType<any>;
  
  // Loading state
  loadingTab?: string | null;
  onLoadingChange?: (tab: string | null) => void;
}

export default function Sidebar({ 
  isExpanded, 
  onExpandedChange, 
  config = defaultSidebarConfig,
  currentPath,
  onNavigate,
  notificationCount = 0,
  onNotificationClick,
  onAIAssistantClick,
  activeTab: externalActiveTab,
  onActiveTabChange,
  onStorageSet,
  onStorageGet,
  ImageComponent,
  LinkComponent,
  loadingTab: externalLoadingTab,
  onLoadingChange
}: SidebarProps) {
  
  // Merge config with defaults
  const finalConfig = {
    ...defaultSidebarConfig,
    ...config,
    app: { ...defaultSidebarConfig.app, ...config?.app },
    appSwitcher: { ...defaultSidebarConfig.appSwitcher, ...config?.appSwitcher },
    aiAssistant: { ...defaultSidebarConfig.aiAssistant, ...config?.aiAssistant },
    notifications: { ...defaultSidebarConfig.notifications, ...config?.notifications }
  };
  
  // Initialize activeTab based on current pathname or external prop
  const getInitialTab = () => {
    if (externalActiveTab) {
      return externalActiveTab;
    }
    
    // Check if current pathname matches any tab
    if (currentPath) {
      const currentTab = finalConfig.navigation.find(tab => tab.path === currentPath);
      if (currentTab) {
        return currentTab.name;
      }
    }
    
    // Check storage if available
    if (onStorageGet) {
      const savedTab = onStorageGet('activeTab_hyperion');
      if (savedTab) {
        return savedTab;
      }
    }
    
    // Default to first navigation tab
    return finalConfig.navigation[0]?.name || 'Dashboard';
  };
  
  const [internalActiveTab, setInternalActiveTab] = useState<string>(getInitialTab());
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false);
  const [internalLoadingTab, setInternalLoadingTab] = useState<string | null>(null);
  const [showText, setShowText] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Add a ref to track if we're animating
  const isAnimatingRef = useRef(false);

  // Use external state if provided, otherwise use internal state
  const activeTab = externalActiveTab ?? internalActiveTab;
  const loadingTab = externalLoadingTab ?? internalLoadingTab;

  // Theme-aware background classes using Tailwind dark: classes
  const submenuBg = 'bg-primary-900 dark:bg-neutral-900';
  const loadingBg = 'bg-primary-800/80 dark:bg-neutral-800/80';
  const sidebarBg = '#17314ae6'; // primary.600 with 90% opacity for light, will be overridden by dark mode

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
    
    // Update activeTab from storage if available and no external control
    if (!externalActiveTab && onStorageGet && !currentPath) {
      const savedTab = onStorageGet('activeTab_hyperion');
      if (savedTab) {
        setInternalActiveTab(savedTab);
      }
    }
  }, [currentPath, externalActiveTab, onStorageGet]);

  // Handle text visibility based on expansion state
  useEffect(() => {
    if (isExpanded) {
      // Delay showing text until expansion is nearly complete (90% done)
      const timer = setTimeout(() => {
        setShowText(true);
      }, 270); // Show text at 90% of the 300ms transition
      return () => clearTimeout(timer);
    } else {
      // Hide text immediately when collapsing
      setShowText(false);
    }
  }, [isExpanded]);

  useEffect(() => {
    // Determine active tab based on current pathname
    if (currentPath) {
      const currentTab = finalConfig.navigation.find(tab => tab.path === currentPath);
      if (currentTab) {
        const newActiveTab = currentTab.name;
        if (!externalActiveTab) {
          setInternalActiveTab(newActiveTab);
        }
        if (onActiveTabChange) {
          onActiveTabChange(newActiveTab);
        }
        if (isHydrated && onStorageSet) {
          onStorageSet('activeTab_hyperion', newActiveTab);
        }
      }
    }
    
    // Clear loading state when pathname changes (navigation completed)
    if (!externalLoadingTab) {
      setInternalLoadingTab(null);
    }
    if (onLoadingChange) {
      onLoadingChange(null);
    }
  }, [currentPath, isHydrated, finalConfig.navigation, externalActiveTab, onActiveTabChange, onStorageSet, externalLoadingTab, onLoadingChange]);

  // Handle expansion state changes
  const handleExpandChange = useCallback((expanded: boolean) => {
    // Mark that we're animating
    isAnimatingRef.current = true;
    
    // Add class to disable transitions on main content
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.classList.add('no-transitions');
    }
    
    // Call the expansion handler
    onExpandedChange(expanded);
    
    // Remove the no-transitions class after sidebar animation completes
    setTimeout(() => {
      if (mainElement) {
        mainElement.classList.remove('no-transitions');
      }
      isAnimatingRef.current = false;
    }, 350); // Slightly longer than the 300ms sidebar transition
  }, [onExpandedChange]);

  // Handle click outside to close menus and collapse sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close menus and collapse if clicking outside sidebar
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsAppSwitcherOpen(false);
        // Collapse sidebar if it's expanded (regardless of submenu state)
        if (isExpanded) {
          handleExpandChange(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isExpanded, handleExpandChange]);

  const handleTabClick = (tabName: string, tabPath?: string) => {
    const newActiveTab = tabName;
    
    // Update internal state if not externally controlled
    if (!externalActiveTab) {
      setInternalActiveTab(newActiveTab);
    }
    
    // Notify external handler
    if (onActiveTabChange) {
      onActiveTabChange(newActiveTab);
    }
    
    // Save to storage if available
    if (isHydrated && onStorageSet) {
      onStorageSet('activeTab_hyperion', newActiveTab);
    }
    
    // Set loading state for the clicked tab
    if (tabPath) {
      if (!externalLoadingTab) {
        setInternalLoadingTab(tabName);
      }
      if (onLoadingChange) {
        onLoadingChange(tabName);
      }
    }
    
    // Collapse sidebar and close app switcher when a tab is clicked
    handleExpandChange(false);
    setIsAppSwitcherOpen(false);
    
    // Navigate to the specified path
    if (tabPath && onNavigate) {
      onNavigate(tabPath);
    } else if (!tabPath) {
      // Fallback to the old event system for tabs without paths
      window.dispatchEvent(new Event('app:change'));
    }
  };

  const handleAppSwitcherClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!isExpanded) {
      // If sidebar is collapsed, expand it and open app switcher
      handleExpandChange(true);
      setIsAppSwitcherOpen(true);
    } else {
      // If sidebar is already expanded, just toggle app switcher
      setIsAppSwitcherOpen(!isAppSwitcherOpen);
    }
  };

  const handleExpandClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleExpandChange(!isExpanded);
    setIsAppSwitcherOpen(false);
  };

  const handleAIChatClick = () => {
    if (onAIAssistantClick) {
      onAIAssistantClick();
    }
  };

  const handleNotificationClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  // Function to render the appropriate icon
  const renderIcon = (icon: string | ComponentType<any>, isLarge: boolean = false) => {
    const iconClass = isLarge ? "w-7 h-7 text-neutral-50" : "w-6 h-6 text-neutral-50";
    const imageSize = isLarge ? 28 : 24;
    
    // If it's a React component, render it directly
    if (typeof icon !== 'string') {
      const IconComponent = icon;
      return <IconComponent className={iconClass} />;
    }
    
    // Otherwise, it's a string path to an image
    if (ImageComponent) {
      return (
        <ImageComponent 
          src={icon}
          alt="icon"
          width={imageSize}
          height={imageSize}
          className={isLarge ? "" : "mb-2"}
        />
      );
    }
    
    // Fallback to regular img tag
    return (
      <img 
        src={icon}
        alt="icon"
        width={imageSize}
        height={imageSize}
        className={isLarge ? "" : "mb-2"}
      />
    );
  };

  // Default components if not provided
  const Image = ImageComponent || (({ src, alt, width, height, className, ...props }: any) => (
    <img src={src} alt={alt} width={width} height={height} className={className} {...props} />
  ));
  
  const Link = LinkComponent || (({ href, children, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ));

  return (
    <div className="relative" ref={sidebarRef}>
      <aside 
        className={`sticky top-0 h-screen flex flex-col font-heading ${isExpanded ? 'w-[180px]' : 'w-[64px]'} transition-all duration-300 ease-in-out overflow-hidden`}
        style={{ backgroundColor: sidebarBg }}
      >
        {/* Background layer to prevent flashes */}
        <div 
          className="absolute inset-0 z-0 bg-[#17314ae6] dark:bg-neutral-800" 
        />
        
        {/* Fixed Top section - App icon and switcher */}
        <div className="w-full transition-all duration-150 ease-in-out relative z-10 mb-4">
          {/* App Home Icon - Fixed height container */}
          <Link href={finalConfig.app.homeUrl}>
            <Tooltip 
              content={finalConfig.app.name} 
              position="right" 
              disabled={isExpanded}
              delay={100}
              className="block w-full"
            >
              <div className={`group ${isExpanded ? 'h-[100px]' : 'h-[80px]'} flex flex-col items-center justify-center pt-2 cursor-pointer transition-all duration-300 ease-in-out w-full`}>
                <div className="flex flex-col items-center gap-[5px]">
                  <div className="h-[26px] flex items-center justify-center">
                    {typeof finalConfig.app.logoSrc === 'string' ? (
                      <Image 
                        src={finalConfig.app.logoSrc}
                        alt={finalConfig.app.name}
                        width={26}
                        height={26}
                        className="group-hover:opacity-60 transition-opacity duration-50"
                      />
                    ) : (
                      <finalConfig.app.logoSrc className="w-[26px] h-[26px] text-neutral-50 group-hover:opacity-60 transition-opacity duration-50" />
                    )}
                  </div>
                  {isExpanded && (
                    <h1 className={`text-neutral-50 group-hover:text-neutral-50/[.6] text-[16px] tracking-wider font-body transition-all duration-300 ease-in-out ${showText ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                      {finalConfig.app.name.toUpperCase()}
                    </h1>
                  )}
                </div>
              </div>
            </Tooltip>
          </Link>

          {/* App Switcher Icon - Fixed height container */}
          {finalConfig.appSwitcher?.enabled && (
            <div className="w-full flex justify-center pb-4 h-[44px] items-center transition-all duration-300 ease-in-out">
              <Tooltip 
                content="Switch Apps" 
                position="right" 
                disabled={isExpanded}
                delay={100}
              >
                <Image 
                  src="/icons/vertical-nav/app-switcher.svg"
                  alt="App Switcher"
                  width={20}
                  height={20}
                  className="opacity-50 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  onClick={(e: React.MouseEvent) => handleAppSwitcherClick(e)}
                />
              </Tooltip>
            </div>
          )}
        </div>

        {/* App Switcher Submenu - Separate from fixed header */}
        {isExpanded && isAppSwitcherOpen && finalConfig.appSwitcher?.enabled && finalConfig.appSwitcher.apps && (
          <div className={`${submenuBg} w-full py-4 px-4 transition-all duration-300 ease-in-out relative z-10 ${showText ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className="flex flex-col gap-5">
              {finalConfig.appSwitcher.apps.map((app) => (
                <Link key={app.name} href={app.href}>
                  <div className="flex items-center gap-3 font-normal text-neutral-50 text-[14px] tracking-widest hover:text-neutral-300 transition-colors duration-200 cursor-pointer">
                    {typeof app.logoSrc === 'string' ? (
                      <Image 
                        src={app.logoSrc}
                        alt={app.name}
                        width={20}
                        height={20}
                      />
                    ) : (
                      <app.logoSrc className="w-5 h-5 text-neutral-50" />
                    )}
                    <span className="uppercase">{app.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Middle section - navigation tabs */}
        <div className={`flex-1 flex flex-col ${isExpanded ? 'items-start' : 'items-center'} py-6 gap-6 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-all duration-300 ease-in-out relative z-10`}>
          {finalConfig.navigation.map((tab) => (
            <Tooltip
              key={tab.name}
              content={tab.name}
              position="right"
              disabled={isExpanded}
              delay={100}
            >
              <div 
                className={`flex ${isExpanded ? 'flex-row w-full px-4 gap-3' : 'flex-col'} items-center cursor-pointer group relative ${activeTab === tab.name ? 'opacity-100' : 'opacity-50'} hover:opacity-100 transition-opacity duration-200`}
                onClick={() => handleTabClick(tab.name, tab.path)}
                role="button"
                tabIndex={0}
                aria-label={`Go to ${tab.name}`}
              >
                {/* Loading spinner overlay */}
                {loadingTab === tab.name && (
                  <div className={`absolute inset-0 flex items-center justify-center ${loadingBg} rounded-lg z-10`}>
                    <Spinner variant="light" size="md" aria-label={`Loading ${tab.name}`} />
                  </div>
                )}
                
                {/* Tab content */}
                <div className={`flex ${isExpanded ? 'flex-row gap-3' : 'flex-col'} items-center ${loadingTab === tab.name ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
                  <div className={isExpanded ? '' : 'mb-2'}>
                    {renderIcon(tab.icon, isExpanded)}
                  </div>
                  {isExpanded && (
                    <span className={`text-neutral-50 tracking-wider text-[15px] transition-all duration-300 ease-in-out ${showText ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                      {tab.name}
                    </span>
                  )}
                </div>
              </div>
            </Tooltip>
          ))}
        </div>

        {/* Bottom section - AI Chat button and expand button */}
        <div className="w-full transition-all duration-300 ease-in-out relative z-10 mt-4">
          <div className="h-[80px] w-full flex flex-col items-center justify-center relative mb-6">
            {/* AI Chat Icon */}
            {finalConfig.aiAssistant?.enabled && (
              <Tooltip
                content={finalConfig.aiAssistant.name}
                position="right"
                disabled={isExpanded}
                delay={100}
              >
                <div 
                  className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-success-500 to-success-700 flex items-center justify-center cursor-pointer hover:from-success-700 hover:to-success-500 transition-all duration-200 shadow-md"
                  role="button"
                  aria-label={`Open ${finalConfig.aiAssistant.name}`}
                  tabIndex={0}
                  onClick={handleAIChatClick}
                >
                  {finalConfig.aiAssistant.icon ? (
                    <finalConfig.aiAssistant.icon className="w-5 h-5 text-neutral-50" />
                  ) : (
                    <SparklesIcon className="w-5 h-5 text-neutral-50" />
                  )}
                </div>
              </Tooltip>
            )}

            {/* Notification Badge */}
            {finalConfig.notifications?.enabled && (
              <div className={`relative ${finalConfig.aiAssistant?.enabled ? 'mt-3' : ''}`}>
                <Tooltip
                  content="Notifications"
                  position="right"
                  disabled={isExpanded}
                  delay={100}
                >
                  <div
                    className="cursor-pointer"
                    onClick={handleNotificationClick}
                    role="button"
                    aria-label="Open notifications"
                    tabIndex={0}
                  >
                    <NotificationBadge count={notificationCount} variant="md" />
                  </div>
                </Tooltip>
              </div>
            )}

            {/* Expand/Collapse Icon */}
            <Tooltip
              content="Expand"
              position="right"
              disabled={isExpanded}
              delay={100}
            >
              <div 
                className={`cursor-pointer hover:opacity-60 transition-opacity duration-200 ${finalConfig.notifications?.enabled || finalConfig.aiAssistant?.enabled ? 'mt-5' : ''}`}
                onClick={handleExpandClick}
                role="button"
                aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
                tabIndex={0}
              >
                {isExpanded ? (
                  <ArrowLeftStartOnRectangleIcon className="w-5 h-5 text-neutral-400 dark:text-neutral-200 transition-opacity duration-300" />
                ) : (
                  <ArrowRightStartOnRectangleIcon className="w-5 h-5 text-neutral-400 dark:text-neutral-200 transition-opacity duration-300" />
                )}
              </div>
            </Tooltip>
          </div>
        </div>
      </aside>
    </div>
  );
}
