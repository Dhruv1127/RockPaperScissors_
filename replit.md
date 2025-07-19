# System Architecture

## Overview

This is a full-stack web application built with a React frontend and Express.js backend. The application appears to be a Rock Paper Scissors game with a modern, component-based architecture using TypeScript throughout. The system uses a monorepo structure with shared types and schemas between frontend and backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Build**: esbuild for fast production builds
- **Storage**: Currently using in-memory storage with interface for future database integration

### Data Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (via Neon Database serverless driver)
- **Schema**: Shared TypeScript schemas between frontend and backend
- **Validation**: Zod schemas for runtime type validation

## Key Components

### Frontend Components
- **Game Logic**: Rock Paper Scissors game implementation with state management
- **UI Components**: Comprehensive set of reusable components based on Radix UI
- **Routing**: Simple routing with game page and 404 handling
- **Notifications**: Toast system for user feedback

### Backend Components
- **API Routes**: RESTful API structure (currently empty, ready for implementation)
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **User Management**: Basic user schema and CRUD operations defined
- **Request Logging**: Middleware for API request logging and monitoring

### Shared Components
- **Database Schema**: User table definition with Drizzle ORM
- **Type Definitions**: Shared TypeScript types for data consistency
- **Validation Schemas**: Zod schemas for data validation

## Data Flow

1. **Frontend Requests**: React components use TanStack Query for API calls
2. **API Layer**: Express.js handles HTTP requests with JSON middleware
3. **Storage Layer**: Abstracted storage interface allows switching between in-memory and database storage
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

The architecture is designed for scalability with clear separation of concerns, type safety throughout the stack, and a flexible storage layer that can evolve from in-memory to full database implementation.