# System Architecture

## Overview

This is a pure HTML, CSS, and JavaScript Rock Paper Scissors game with a modern, animated interface. The application features a beautiful home screen with floating animations, sound effects, and a fully interactive game with an AI opponent. The system has been converted from a React-based application to a vanilla web application for maximum compatibility and performance.

## User Preferences

Preferred communication style: Simple, everyday language.
Project Type: Pure HTML, CSS, and JavaScript (converted from React)

## System Architecture

### Frontend Architecture
- **Technology Stack**: Pure HTML5, CSS3, and ES6+ JavaScript
- **Styling**: Modern CSS with custom properties, animations, and responsive design
- **Audio**: Web Audio API for sound effects and user interaction feedback
- **State Management**: Vanilla JavaScript object-based state management
- **Animations**: CSS keyframes and transitions for smooth user experience
- **Responsive**: Mobile-first design with CSS Grid and Flexbox

### Backend Architecture
- **Server**: Simple Express.js static file server
- **Runtime**: Node.js for development server
- **Files**: Static HTML, CSS, and JavaScript files
- **No Build Process**: Direct browser execution without compilation
- **Deployment**: Static file hosting compatible

## Key Components

### Frontend Components
- **Home Screen**: Animated welcome screen with start/quit game options, background effects, and sound controls
- **Game Logic**: Rock Paper Scissors game implementation with state management and sound effects
- **UI Components**: Comprehensive set of reusable components based on Radix UI
- **Routing**: Simple routing with home screen, game page and 404 handling
- **Audio System**: Web Audio API integration for sound effects and user interaction feedback
- **Notifications**: Toast system for user feedback

### Backend Components
- **API Routes**: RESTful API with user management, game results, and statistics endpoints
- **Storage Interface**: Database storage layer with PostgreSQL integration
- **User Management**: Complete user CRUD operations with password handling
- **Game Statistics**: Real-time game result tracking and user statistics
- **Request Logging**: Middleware for API request logging and monitoring

### Shared Components
- **Database Schema**: Complete game database with users, game results, and user statistics tables
- **Type Definitions**: Shared TypeScript types for data consistency across frontend and backend
- **Validation Schemas**: Zod schemas for runtime data validation
- **Relations**: Drizzle ORM relations for efficient database queries

## Data Flow

1. **Frontend Requests**: React components use TanStack Query for API calls
2. **API Layer**: Express.js handles HTTP requests with JSON middleware
3. **Storage Layer**: PostgreSQL database with Drizzle ORM for persistent data storage
4. **Data Validation**: Zod schemas validate data at API boundaries
5. **Response Handling**: Standardized error handling and response formatting

## External Dependencies

### Frontend Dependencies
- **UI**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **State**: TanStack Query for server state management
- **Forms**: React Hook Form for form handling
- **Validation**: Zod for schema validation
- **Routing**: Wouter for lightweight routing

### Backend Dependencies
- **Database**: Neon Database serverless PostgreSQL
- **ORM**: Drizzle ORM for type-safe database operations
- **Session**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution

### Development Tools
- **Build**: Vite for frontend, esbuild for backend
- **Database**: Drizzle Kit for schema migrations
- **Linting**: TypeScript compiler for type checking
- **Replit**: Specific plugins for Replit development environment

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution with auto-restart
- **Database**: Drizzle push for schema updates
- **Environment**: Replit-optimized with runtime error overlay

### Production
- **Frontend**: Static build output served by Express
- **Backend**: Compiled JavaScript bundle with esbuild
- **Database**: PostgreSQL migrations via Drizzle Kit
- **Serving**: Single Express server serving both API and static files

### Configuration
- **Environment Variables**: DATABASE_URL for database connection
- **Build Process**: Sequential frontend and backend builds
- **Asset Handling**: Vite handles frontend assets, Express serves them in production
- **Error Handling**: Global error middleware with proper status codes and JSON responses

The architecture is designed for scalability with clear separation of concerns, type safety throughout the stack, and a PostgreSQL database backend for persistent game data and user statistics tracking.