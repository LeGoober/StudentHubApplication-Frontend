# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Discord clone React frontend application built with TypeScript that communicates with a Spring Boot backend. It features user authentication, channel management, and profile functionality.

## Development Commands

- **Start development server**: `npm start` (uses craco, runs on http://localhost:3000)
- **Run tests**: `npm test` (launches test runner in watch mode)
- **Build for production**: `npm build` (creates optimized production build)
- **Install dependencies**: `npm install`

## Architecture

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **State Management**: Redux Toolkit with three main slices (auth, channel, profile)
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4 + CSS Modules
- **Build Tool**: CRACO (Create React App Configuration Override)
- **HTTP Client**: Axios for API communication
- **Backend**: Spring Boot (external, runs on localhost:8080)

### Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Main application screens (Login, Signup, Channel, Profile)
├── store/              # Redux store configuration
│   └── slices/         # Redux slices for state management
├── services/           # API service functions
├── config.ts           # Environment configuration
└── types.d.ts          # TypeScript type declarations
```

### State Management Architecture
The Redux store is organized into three main slices:
- **authSlice**: Manages authentication tokens
- **channelSlice**: Handles channel-related state
- **profileSlice**: Manages user profile data

### API Integration
- Backend API base URL: `http://localhost:8080` (configurable via REACT_APP_API_URL)
- Authentication: Bearer token-based authentication
- Main API endpoints include:
  - `/auth/login` and `/auth/register` for authentication
  - `/channel/getAll` and `/channel/create` for channel management
  - `/user_profile/getAll` and `/user_profile/read/{id}` for profiles
  - `/user_post/getAll` for posts

### Component Architecture
- Uses CSS Modules for component-specific styling (`.module.css` files)
- Components are organized by functionality with co-located styles
- Main routing structure includes: `/`, `/login`, `/signup`, `/channels`, `/profile/:id`

## Configuration

- **CRACO Config**: Custom webpack configuration for development server setup
- **TypeScript**: Strict mode enabled with React JSX transform
- **Testing**: Jest with React Testing Library setup
- **Tailwind**: Version 4.x configuration

## Known Issues

- The `config.ts` file contains a syntax error in the API_URL export that should be fixed
- Uses `@ts-ignore` in App.tsx which should be addressed

## Backend Dependency

This frontend requires a Spring Boot backend running on port 8080. Make sure the backend is running with `mvn spring-boot:run` before starting the frontend development server.