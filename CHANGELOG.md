# Changelog

All notable changes to CarRental project will be documented in this file.

## [2.3.4] - 2025-10-01

### Added
- **Role-Based User Popups**: Differentiated user menus for admin panel and public pages
  - `UserNavMenu`: User-focused menu with rental actions (bookings, favorites)
  - `Admin UserMenu`: Management-focused menu with quick access to admin pages
- **Admin Branding**: Orange color scheme for admin popup with Shield icon
- **Conditional Admin Access**: Admin panel link shown only to admin users in UserNavMenu
- **Enhanced Navigation**: Quick access links for both admin and user contexts
- **Theme Switcher**: Integrated theme selection in both user menus
- **Visual Hierarchy**: Distinct header designs for admin (orange) vs user (neutral) menus

### Changed
- Updated `UserNavMenu.jsx` with expanded features and admin detection
- Updated `Admin UserMenu.jsx` with orange admin branding and quick access links
- Improved menu structure with logical grouping of actions
- Enhanced dark mode support for admin orange theme

## [2.3.3] - 2025-10-01

### Added
- **User Name Synchronization**: Added `name` field across database, API, and UI
  - Database schema updated with `name VARCHAR(100)` column
  - Mock database includes default admin name "Quản Trị Viên"
  - Auth API returns `name` in login and verify responses
- **Dynamic User Data**: Admin sidebar now reads user data from localStorage
- **Fallback Logic**: Name fallback hierarchy (name → username → 'User')

### Changed
- Updated `schema.sql` to include `name` field in users table
- Updated `auth.js` routes to select and return `name` field
- Updated `Sidebar.jsx` to use IIFE for dynamic user data loading
- Improved user data consistency across entire application

## [2.3.2] - 2025-10-01

### Added
- **Username Display**: Added username next to avatar in UserNavMenu (desktop)
- **Circular Avatars**: Standardized rounded-full avatar styling across all menus
- **Theme-Aware Colors**: Replaced hardcoded gradients with dynamic theme colors

### Changed
- Updated `UserNavMenu.jsx` to display username on desktop (hidden on mobile)
- Updated `Admin UserMenu.jsx` to use circular avatars and theme colors
- Improved responsive design with sm:inline-block for username

## [2.3.1] - 2025-10-01

### Added
- **UserNavMenu Component**: New user navigation menu for public/user pages
- **Dynamic Navbar**: Smart navbar that shows login buttons or UserNavMenu based on auth status
- **Theme Toggle**: Dark mode switcher with Monitor icon for system theme

### Changed
- Updated `HomePage.jsx` navbar to use UserNavMenu when user is logged in
- Updated `ThemeToggle.jsx` to use Lucide Monitor icon instead of emoji
- Improved navbar UX with conditional rendering

## [2.3.0] - 2025-10-01

### Added
- **Modern Dark Mode**: GitHub-inspired dark theme with proper contrast
  - Brighter text colors for better readability
  - Enhanced shadow and glow effects
  - Semantic color system (success, warning, info)
- **Reusable Components**: Created 7 new shared UI components
  - `StatCard`: Statistics display component
  - `CarCard`: Car information card
  - `LoadingSpinner`: Loading states (page, card, spinner)
  - `EmptyState`: Empty state displays
  - `PageHeader`: Consistent page headers
  - `ChartPlaceholder`: Chart and feature placeholders
  - `TablePlaceholder`: Table placeholder component
- **Component Index**: Centralized exports in `ui/index.js`
- **ThemeProvider**: React Context for theme management
- **Vietnamese Localization**: Full i18n support for dashboard and UI elements

### Changed
- Refactored `Dashboard.jsx` to use reusable components
- Refactored `UserManagement.jsx` to use PageHeader
- Refactored `CarManagement.jsx` to use PageHeader
- Updated `index.css` with modern dark mode variables
- Improved component reusability across admin and user pages

### Fixed
- JSX closing tag mismatch in Dashboard
- EmptyState import path error
- Dark mode text visibility issues

## [2.2.0] - 2025-09-30

### Added
- **shadcn Dark Mode**: Theme switching with light/dark/system modes
- **Admin UserMenu**: Redesigned user dropdown menu with shadcn components
- **Lucide Icons**: Updated all icons to Lucide v0.544.0
- **Vietnamese Localization**: Complete Vietnamese translation for UserMenu

### Changed
- Updated `UserMenu.jsx` with shadcn-compliant design
- Removed Team, Invite user, GitHub, API, Billing menu items
- Removed macOS keyboard shortcuts
- Updated all icon imports to use Lucide React

## [2.1.0] - 2025-09-30

### Added
- Initial project setup with monorepo structure
- Backend API with Express.js
- Frontend with React and Vite
- PostgreSQL database integration
- Mock database for development
- Basic authentication system
- Admin panel with car and user management
- Homepage with car listing

### Changed
- Converted project to npm workspaces
- Added Docker support
- Configured Tailwind CSS

---

## Legend
- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

