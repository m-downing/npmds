import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, PlusIcon, ClockIcon, XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';
import NotificationBadge from '../components/feedback/NotificationBadge';

// Note interface
interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

// Framework-agnostic props interface
export interface AccountDrawerProps {
  // Optional notification features
  notificationCount?: number;
  onNotificationClick?: () => void;
  onPreferencesClick?: () => void;
  
  // Optional storage callbacks
  onStorageSet?: (key: string, value: string) => void;
  onStorageGet?: (key: string) => string | null;
  
  // Optional modals
  NotificationModal?: React.ComponentType<{ isOpen: boolean; onClose: () => void }>;
  PreferencesModal?: React.ComponentType<{ isOpen: boolean; onClose: () => void }>;
  
  // Optional state management
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const AccountDrawer: React.FC<AccountDrawerProps> = ({
  notificationCount = 0,
  onNotificationClick,
  onPreferencesClick,
  onStorageSet,
  onStorageGet,
  NotificationModal,
  PreferencesModal,
  isOpen: externalIsOpen,
  onOpenChange,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isUserPreferencesModalOpen, setIsUserPreferencesModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  // Load notes from storage on mount
  useEffect(() => {
    const savedNotes = onStorageGet?.('scm-notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        // Convert timestamp strings back to Date objects
        const notesWithDates = parsedNotes.map((note: Note & { timestamp: string }) => ({
          ...note,
          timestamp: new Date(note.timestamp)
        }));
        setNotes(notesWithDates);
      } catch (error) {
        console.error('Error loading notes from storage:', error);
      }
    }
  }, [onStorageGet]);

  // Handle click outside to close drawer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close drawer if a modal is open
      if (isNotificationsModalOpen || isUserPreferencesModalOpen) {
        return;
      }
      
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, isNotificationsModalOpen, isUserPreferencesModalOpen]);

  const handleNotificationsClick = () => {
    // Close preferences modal if open
    setIsUserPreferencesModalOpen(false);
    setIsNotificationsModalOpen(true);
    
    // Call external callback if provided
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  const handlePreferencesClick = () => {
    // Close notifications modal if open
    setIsNotificationsModalOpen(false);
    setIsUserPreferencesModalOpen(true);
    
    // Call external callback if provided
    if (onPreferencesClick) {
      onPreferencesClick();
    }
  };

  const handleSaveNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: noteTitle.trim(),
      content: noteContent.trim(),
      timestamp: new Date()
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    
    // Save to storage if callback provided
    if (onStorageSet) {
      onStorageSet('scm-notes', JSON.stringify(updatedNotes));
    }
    
    // Clear form
    setNoteTitle('');
    setNoteContent('');
  };

  const handleClearForm = () => {
    setNoteTitle('');
    setNoteContent('');
  };

  const toggleNoteExpansion = (noteId: string) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  const handleDeleteNote = (noteId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent note expansion when clicking delete
    
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    
    // Update storage if callback provided
    if (onStorageSet) {
      onStorageSet('scm-notes', JSON.stringify(updatedNotes));
    }
    
    // Clear expansion if this note was expanded
    if (expandedNoteId === noteId) {
      setExpandedNoteId(null);
    }
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Always show date and time for clarity
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
    
    if (days === 0) {
      return `Today at ${timeStr}`;
    } else if (days === 1) {
      return `Yesterday at ${timeStr}`;
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <>
      {/* Tab trigger - Only visible when drawer is closed */}
      {!isOpen && (
        <div className="fixed top-4 right-0 transition-all duration-300 ease-out z-[60]">
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center justify-center w-8 h-14 rounded-l-xl border border-r-0 transition-all duration-300 hover:w-9 overflow-visible bg-gradient-to-r from-white to-neutral-50 hover:from-neutral-50 hover:to-neutral-100 border-neutral-300 shadow-lg dark:bg-gradient-to-r dark:from-neutral-800 dark:to-neutral-700 dark:hover:from-neutral-700 dark:hover:to-neutral-600 dark:border-neutral-600 dark:shadow-lg"
            aria-label="Open drawer"
          >
            <ChevronLeftIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-300 transition-all duration-300" />
            <NotificationBadge count={notificationCount} variant="sm" className="absolute -top-1.5 -left-1.5 z-10" />
          </button>
        </div>
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-[500px] z-[60] transform transition-all duration-500 ease-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'
        } bg-gradient-to-br from-white to-neutral-50 border-neutral-200 dark:bg-gradient-to-br dark:from-neutral-900 dark:to-neutral-800 dark:border-neutral-700 border-l flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0 relative overflow-hidden">
          {/* Background gradient overlay for subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/20 dark:bg-gradient-to-br dark:from-white/[0.02] dark:via-transparent dark:to-white/[0.01]" />
          
          <div className="flex items-center justify-between relative z-10">
            {/* Preferences text */}
            <div 
              className="cursor-pointer group"
              onClick={handlePreferencesClick}
            >
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-neutral-400 transition-colors duration-200">Preferences</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5 flex items-center gap-1.5">
                <Cog6ToothIcon className="w-4 h-4" />
                Manage your account settings
              </p>
            </div>
            
            {/* User Profile Icon */}
            <div className="relative">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 bg-gradient-to-br from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700 dark:bg-gradient-to-br dark:from-neutral-600 dark:to-neutral-700 dark:hover:from-neutral-500 dark:hover:to-neutral-600"
                onClick={handleNotificationsClick}
              >
                <UserIcon className="w-7 h-7 text-white" />
              </div>
              <NotificationBadge count={notificationCount} variant="md" />
            </div>
          </div>
        </div>

        {/* Content Area - Note Taking System */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Note Input Area - Top Half */}
          <div className="p-6 space-y-4 flex-shrink-0">
            <div className="relative">
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full px-4 py-3 pr-10 text-sm border rounded-md focus:outline-none transition-all duration-200 bg-white/70 backdrop-blur border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 shadow-sm dark:bg-neutral-800/50 dark:backdrop-blur dark:border-neutral-600 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-neutral-400 dark:focus:ring-2 dark:focus:ring-neutral-400/20 dark:shadow-inner"
              />
              {(noteTitle || noteContent) && (
                <button
                  onClick={handleClearForm}
                  className="absolute right-3 top-3 p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-200"
                  aria-label="Clear form"
                >
                  <XMarkIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                </button>
              )}
            </div>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your note here..."
              className="w-full px-4 py-3 text-sm border rounded-md focus:outline-none transition-all duration-200 resize-none h-48 bg-white/70 backdrop-blur border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 shadow-sm dark:bg-neutral-800/50 dark:backdrop-blur dark:border-neutral-600 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-neutral-400 dark:focus:ring-2 dark:focus:ring-neutral-400/20 dark:shadow-inner"
            />
            <button
              onClick={handleSaveNote}
              disabled={!noteTitle.trim() || !noteContent.trim()}
              className="w-full px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 dark:bg-gradient-to-r dark:from-neutral-700 dark:to-neutral-600 dark:hover:from-neutral-600 dark:hover:to-neutral-500 dark:text-neutral-100 dark:shadow-lg dark:hover:shadow-xl dark:transform dark:hover:-translate-y-0.5"
            >
              <PlusIcon className="w-4 h-4" />
              Save Note
            </button>
          </div>

          {/* Divider with gradient */}
          <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-neutral-600 dark:to-transparent" />

          {/* Saved Notes List - Bottom Half */}
          <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Previous Notes</h3>
              {notes.length > 0 && (
                <span className="text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-700 px-2 py-1 rounded-full">
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                </span>
              )}
            </div>
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <ClockIcon className="w-10 h-10 text-neutral-600 dark:text-neutral-400" />
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  No notes yet. Create your first note above!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => toggleNoteExpansion(note.id)}
                    onMouseEnter={() => setHoveredNoteId(note.id)}
                    onMouseLeave={() => setHoveredNoteId(null)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 relative transform hover:-translate-y-1 bg-gradient-to-br from-white to-neutral-50 hover:from-neutral-50 hover:to-neutral-100 border-neutral-200 shadow-sm hover:shadow-md dark:bg-gradient-to-br dark:from-neutral-800 dark:to-neutral-750 dark:hover:from-neutral-750 dark:hover:to-neutral-700 dark:border-neutral-700 dark:shadow-md dark:hover:shadow-lg ${
                      expandedNoteId === note.id ? 'ring-2 ring-primary-500 ring-opacity-50' : ''
                    }`}
                  >
                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className={`absolute top-3 right-3 p-1.5 rounded-lg ${
                        hoveredNoteId === note.id ? 'opacity-100' : 'opacity-0'
                      } hover:bg-error-50 dark:hover:bg-error-500/20 transition-all duration-200`}
                      aria-label="Delete note"
                    >
                      <XMarkIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-300 hover:text-error-500 dark:hover:text-error-300" />
                    </button>
                    
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2 pr-8">
                      {note.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 mb-3">
                      <ClockIcon className="w-3.5 h-3.5" />
                      {formatTimestamp(note.timestamp)}
                    </div>
                    <p className={`text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed ${
                      expandedNoteId === note.id ? '' : 'line-clamp-2'
                    }`}>
                      {expandedNoteId === note.id ? note.content : truncateText(note.content)}
                    </p>
                    {expandedNoteId !== note.id && note.content.length > 80 && (
                      <p className="text-xs text-primary-600 dark:text-primary-400 mt-2 font-medium">
                        Click to expand...
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {NotificationModal && (
        <NotificationModal
          isOpen={isNotificationsModalOpen}
          onClose={() => setIsNotificationsModalOpen(false)}
        />
      )}

      {PreferencesModal && (
        <PreferencesModal
          isOpen={isUserPreferencesModalOpen}
          onClose={() => setIsUserPreferencesModalOpen(false)}
        />
      )}
    </>
  );
};
