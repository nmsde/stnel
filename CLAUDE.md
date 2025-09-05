# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Laravel React application using Inertia.js as the bridge between backend and frontend. The stack includes:
- Laravel 12 with PHP 8.2+
- React 19 with TypeScript
- Inertia.js for SPA routing
- Laravel WorkOS for authentication
- Tailwind CSS v4 with Radix UI components
- PostgreSQL as database
- Redis for caching/queues

## Development Commands

### Starting the application
```bash
# Run all services (server, queue, logs, vite)
composer dev

# Run with SSR enabled
composer dev:ssr
```

### Testing
```bash
# Run all tests with Pest
composer test

# Run specific test file
./vendor/bin/pest tests/Feature/YourTest.php

# Run tests with filter
./vendor/bin/pest --filter="test name"
```

### Code Quality
```bash
# PHP formatting with Pint
./vendor/bin/pint

# JavaScript/TypeScript linting
npm run lint

# Format JavaScript/TypeScript with Prettier  
npm run format

# Check formatting without applying
npm run format:check

# TypeScript type checking
npm run types
```

### Build Commands
```bash
# Build frontend assets
npm run build

# Build with SSR
npm run build:ssr

# Database migrations
php artisan migrate

# Clear all caches
php artisan optimize:clear
```

## Architecture

### Backend Structure
- **Controllers**: Located in `app/Http/Controllers/`, follow RESTful conventions
- **Models**: Eloquent models in `app/Models/`
- **Middleware**: Custom middleware in `app/Http/Middleware/`, notably `HandleInertiaRequests` and `HandleAppearance`
- **Routes**: Defined in `routes/` directory, split by concern (web.php, auth.php, settings.php)

### Frontend Structure  
- **Pages**: React components in `resources/js/pages/` map to Inertia routes
- **Layouts**: Reusable layout components in `resources/js/layouts/`
- **Components**: 
  - UI primitives in `resources/js/components/ui/` (Radix UI based)
  - App components in `resources/js/components/`
- **Hooks**: Custom React hooks in `resources/js/hooks/`
- **Types**: TypeScript definitions in `resources/js/types/`

### Key Patterns
- Inertia.js handles routing - use `Inertia::render()` in controllers and `<Link>` component in React
- Form handling uses Inertia forms with built-in validation and error handling
- Authentication uses Laravel WorkOS with session validation middleware
- UI components follow shadcn/ui patterns with Radix UI primitives
- Wayfinder plugin provides typed routes between Laravel and TypeScript

### Database & Services
- PostgreSQL runs on port 5432 (via Docker)
- Redis on port 6379 for caching and queues
- Maillinter on port 2525 for local email testing (UI at port 8547)

### Testing Approach
- Pest for PHP testing with Laravel test helpers
- Tests use SQLite in-memory database
- Feature tests in `tests/Feature/`, Unit tests in `tests/Unit/`
- Database refreshed between tests with `RefreshDatabase` trait