# Discord Clone - CPUT StudentHub Frontend

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [API Integration & Backend Communication](#api-integration--backend-communication)
4. [File Structure & Organization](#file-structure--organization)
5. [State Management with Redux](#state-management-with-redux)
6. [Component Architecture](#component-architecture)
7. [Routing System](#routing-system)
8. [Component Enhancement Opportunities](#component-enhancement-opportunities)
9. [Development Workflow](#development-workflow)
10. [Best Practices & Conventions](#best-practices--conventions)

---

## Project Overview

**CPUT StudentHub** is a Discord-inspired communication platform built as a modern React application. The system provides real-time communication features including user authentication, channel management, and user profiles. This frontend application is designed to work seamlessly with a Spring Boot backend API.

### Key Features
- **User Authentication**: Secure login/signup with JWT tokens
- **Channel Management**: Create and browse communication channels
- **User Profiles**: Personal user information and profile management
- **Real-time Communication**: Discord-like interface for messaging
- **Responsive Design**: Mobile-first approach with Tailwind CSS

---

## Architecture & Technology Stack

### Frontend Technologies
- **React 18.2.0**: Component-based UI library with hooks and functional components
- **TypeScript 4.9.5**: Static type checking for enhanced developer experience
- **React Router DOM 6.27.0**: Client-side routing and navigation
- **Redux Toolkit 2.2.8**: Predictable state container with modern Redux patterns
- **Axios 1.7.7**: Promise-based HTTP client with interceptors
- **Tailwind CSS 3.4.14**: Utility-first CSS framework
- **FontAwesome 6.6.0**: Icon library for UI components

### Development Tools
- **React Scripts 5.0.1**: Build toolchain and development server
- **Jest 29.7.0**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **TypeScript**: Enhanced IDE support and compile-time error checking

### Backend Integration
- **Spring Boot API**: RESTful backend service (localhost:8080)
- **JWT Authentication**: Secure token-based authentication
- **RESTful API Design**: Consistent HTTP methods and status codes

---

## API Integration & Backend Communication

### Axios Configuration (`src/services/api.ts`)

The application uses a centralized Axios instance with automatic token management:

```typescript
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Automatic token injection for authenticated requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### API Endpoints

#### Authentication Endpoints
- **POST** `/auth/login` - User authentication
  - **Request**: `{ userEmail: string, userPassword: string }`
  - **Response**: JWT token string
  - **Usage**: Login functionality in `LoginScreen.tsx:19`

- **POST** `/auth/register` - User registration
  - **Request**: `{ userEmail: string, userPassword: string, userFirstName: string, userLastName: string }`
  - **Response**: User registration confirmation
  - **Usage**: Signup functionality

#### Channel Management Endpoints
- **GET** `/channel/getAll` - Fetch all available channels
  - **Response**: Array of channel objects `{ id: number, name: string }[]`
  - **Usage**: Channel listing in `ChannelScreen.tsx:22`

- **POST** `/channel/create` - Create new channel
  - **Request**: `{ name: string, adminId: number }`
  - **Response**: Created channel object
  - **Usage**: Channel creation in `ChannelScreen.tsx:33`

#### User Profile Endpoints
- **GET** `/user_profile/get/{id}` - Fetch user profile by ID
  - **Response**: User profile object
  - **Usage**: Profile screen data loading

### Authentication Flow

1. **Login Process**: User credentials → API call → JWT token → localStorage + Redux store
2. **Token Persistence**: Automatic token attachment to all subsequent API requests
3. **Route Protection**: Redux auth state determines access to protected routes

---

## File Structure & Organization

```
discord-clone/
├── public/
│   ├── Assets/                  # Static media files
│   │   ├── *.jpg, *.png        # User avatars and UI images  
│   │   └── *.mp3               # Discord sound effects
│   ├── favicon.ico             # Browser tab icon
│   └── index.html              # HTML template
│
├── src/
│   ├── components/             # Reusable UI Components
│   │   ├── BottomSection.tsx   # Chat input area
│   │   ├── Button.tsx          # Styled button component
│   │   ├── ChatSidebar.tsx     # Left sidebar for channels
│   │   ├── DiscordLoader.tsx   # Loading animation component
│   │   ├── FriendItem.tsx      # Friend list item component
│   │   ├── Input.tsx           # Styled input field component
│   │   ├── ListItem.tsx        # Generic list item component
│   │   ├── Loader.tsx          # Generic loading spinner
│   │   ├── Main.tsx            # Landing page component
│   │   ├── NavBar.tsx          # Navigation bar component
│   │   ├── Profile.tsx         # Profile display component
│   │   ├── RightSideArea.tsx   # Right sidebar (members/info)
│   │   └── Sidebar.tsx         # Main sidebar navigation
│   │
│   ├── screens/                # Full-page Route Components
│   │   ├── ChannelScreen.tsx   # Channel management page (/channels)
│   │   ├── LoginScreen.tsx     # User authentication (/login)
│   │   ├── ProfileScreen.tsx   # User profile page (/profile/:id)
│   │   └── SignupScreen.tsx    # User registration (/signup)
│   │
│   ├── services/               # API Integration Layer
│   │   └── api.ts              # Axios configuration and API calls
│   │
│   ├── store/                  # Redux State Management
│   │   ├── index.ts            # Store configuration and type exports
│   │   └── slices/             # Feature-based state slices
│   │       ├── authSlice.ts    # Authentication state
│   │       ├── channelSlice.ts # Channel management state
│   │       └── profileSlice.ts # User profile state
│   │
│   ├── App.tsx                 # Main routing component
│   ├── config.ts               # Environment configuration
│   ├── index.tsx               # Application entry point
│   ├── types.d.ts              # Global TypeScript definitions
│   └── *.css                   # Global styling files
│
├── package.json                # Dependencies and build scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── CLAUDE.md                  # Development guidelines
```

### Directory Responsibilities

#### `/components`
**Purpose**: Reusable, stateless UI components that can be used across multiple screens.
**Examples**: Buttons, inputs, navigation elements, loading indicators.
**Best Practice**: Each component should be focused on a single responsibility.

#### `/screens`
**Purpose**: Full-page components that represent different routes in the application.
**Examples**: Login page, channel page, profile page.
**Best Practice**: Screens orchestrate multiple components and handle route-specific logic.

#### `/services`
**Purpose**: External API communication and business logic.
**Examples**: HTTP requests, data transformation, external service integration.
**Best Practice**: Keep API calls centralized and separate from UI components.

#### `/store`
**Purpose**: Application state management using Redux Toolkit.
**Examples**: User authentication state, channel data, UI state.
**Best Practice**: Organize state by feature domains, not by data type.

---

## State Management with Redux

### Store Architecture (`src/store/index.ts`)

The Redux store is organized into feature-based slices:

```typescript
export const store = configureStore({
  reducer: {
    auth: authReducer,      // Authentication state
    channel: channelReducer, // Channel management
    profile: profileReducer, // User profiles
  },
});
```

### Authentication Slice (`src/store/slices/authSlice.ts`)

```typescript
interface AuthState {
  token: string | null;    // JWT authentication token
  user: { id: number } | null; // Current user information
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.user = { id: 1 }; // Should be derived from token payload
    },
  },
});
```

### Channel Slice
Manages channel-related state including:
- List of available channels
- Current active channel
- Channel creation status

### Profile Slice
Handles user profile data:
- User profile information
- Profile loading states
- Profile update operations

### State Flow Example

1. **Login Process**:
   ```typescript
   // LoginScreen.tsx
   const response = await login(userEmail, userPassword);
   localStorage.setItem('token', response.data);
   dispatch(setToken(response.data)); // Updates Redux store
   navigate('/'); // Navigate to home
   ```

2. **Channel Data Flow**:
   ```typescript
   // ChannelScreen.tsx
   useEffect(() => {
     if (token) {
       getChannels()
         .then((response) => {
           dispatch(setChannels(response.data)); // Updates Redux store
         });
     }
   }, [token, dispatch]);
   ```

---

## Component Architecture

### Component Hierarchy

```
App.tsx (Router)
├── LoginScreen
│   ├── Input (email)
│   ├── Input (password)  
│   └── Button (submit)
├── SignupScreen
│   ├── Input (multiple fields)
│   └── Button (register)
├── Main (Home)
│   ├── NavBar
│   ├── Sidebar
│   └── Various content components
├── ChannelScreen
│   ├── Input (channel name)
│   ├── Button (create)
│   └── Channel list items
└── ProfileScreen
    ├── Profile component
    └── Profile-specific UI
```

### Component Communication Patterns

#### 1. **Props Down, Events Up**
```typescript
// Parent component
<Input 
  value={userEmail} 
  onChange={(e) => setUserEmail(e.target.value)}
/>
```

#### 2. **Redux for Global State**
```typescript
// Any component can access global state
const { token, user } = useSelector((state: RootState) => state.auth);
const dispatch = useDispatch();
```

#### 3. **Context for Theme/UI State**
Future enhancement opportunity for themes, modal state, etc.

### Reusable Components

#### Input Component (`src/components/Input.tsx`)
- Standardized form input styling
- TypeScript props for type safety
- Consistent focus/hover states

#### Button Component (`src/components/Button.tsx`)  
- Consistent button styling across the app
- Support for different button variants
- Loading states and disabled states

---

## Routing System

### Route Configuration (`src/App.tsx`)

```typescript
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/channels" element={<ChannelScreen />} />
      <Route path="/profile/:id" element={<ProfileScreen />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
```

### Route Protection Strategy

Currently, route protection is handled at the component level:

```typescript
// Example protected route logic
useEffect(() => {
  if (!token) {
    navigate('/login');
  }
}, [token, navigate]);
```

**Recommendation**: Implement a `ProtectedRoute` component for cleaner route protection.

---

## Component Enhancement Opportunities

### 1. Navigation Component Placements

#### A. Global Navigation Bar
**Location**: `src/components/TopNavBar.tsx` (new component)
**Placement**: All authenticated screens
**Features**:
- User avatar and dropdown menu
- Search functionality  
- Settings and logout options
- Online status indicator

```typescript
// Example implementation location
function ChannelScreen() {
  return (
    <div className="discord-layout">
      <TopNavBar /> {/* Global navigation */}
      <div className="main-content">
        <Sidebar />
        <ChatArea />
        <RightSideArea />
      </div>
    </div>
  );
}
```

#### B. Channel-Specific Navigation
**Location**: `src/components/ChannelHeader.tsx` (new component)
**Placement**: Within `ChannelScreen.tsx`
**Features**:
- Channel name and description
- Member count and online status
- Channel settings and notifications
- Voice/text channel switching

#### C. Authentication Screen Headers
**Location**: `src/components/AuthHeader.tsx` (new component)
**Placement**: `LoginScreen.tsx` and `SignupScreen.tsx`
**Features**:
- Application logo and branding
- Navigation between login/signup
- Help and support links

### 2. Screen-Specific Component Additions

#### Main Screen (`src/components/Main.tsx`)
**Current State**: Landing page component
**Enhancement Opportunities**:
- **Welcome Dashboard**: Recent channels, friend activity
- **Quick Actions Bar**: Create channel, join server, settings
- **Status Widget**: Show user's current status and activity

#### Channel Screen (`src/screens/ChannelScreen.tsx`)
**Current State**: Basic channel list and creation
**Enhancement Opportunities**:
- **Channel Categories**: Group channels by type or topic
- **Member Sidebar**: Show online members with status
- **Chat Interface**: Message history and real-time messaging
- **Voice Controls**: Join/leave voice channels

#### Profile Screen (`src/screens/ProfileScreen.tsx`)
**Current State**: Basic profile display
**Enhancement Opportunities**:
- **Profile Header**: Banner image, avatar, status message
- **Tab Navigation**: About, Activity, Friends, Settings
- **Activity Feed**: Recent messages, channel activity
- **Social Features**: Friend requests, mutual servers

#### Login/Signup Screens
**Current State**: Basic forms with minimal styling
**Enhancement Opportunities**:
- **Progress Indicators**: Multi-step registration process
- **Social Login**: OAuth integration (Google, Microsoft)
- **Password Strength**: Real-time password validation
- **Responsive Design**: Better mobile experience

### 3. New Component Architecture Recommendations

#### Layout Components
```
src/components/layout/
├── TopNavBar.tsx       # Global navigation
├── Sidebar.tsx         # Left sidebar navigation  
├── ChannelHeader.tsx   # Channel-specific header
└── StatusBar.tsx       # Bottom status bar
```

#### Feature Components
```
src/components/features/
├── Chat/
│   ├── ChatInput.tsx
│   ├── MessageList.tsx
│   └── MessageItem.tsx
├── User/
│   ├── UserAvatar.tsx
│   ├── UserStatus.tsx
│   └── UserCard.tsx
└── Channel/
    ├── ChannelList.tsx
    ├── ChannelItem.tsx
    └── CreateChannel.tsx
```

### 4. Implementation Priority

#### High Priority (Core Functionality)
1. **Global Navigation Bar** - Essential for user experience
2. **Chat Interface Components** - Core Discord functionality
3. **User Status Components** - Social features

#### Medium Priority (Enhanced UX)
1. **Channel Categories** - Organization and scalability
2. **Profile Enhancement** - User engagement
3. **Mobile Responsiveness** - Accessibility

#### Low Priority (Nice-to-have)
1. **Voice Channel UI** - Advanced features
2. **Custom Themes** - Personalization
3. **Advanced Settings** - Power user features

---

## Development Workflow

### 1. Environment Setup

```bash
# Backend (Spring Boot)
cd backend-directory
mvn spring-boot:run    # Starts on localhost:8080

# Frontend (React)
cd discord-clone
npm install           # Install dependencies
npm start            # Starts on localhost:3000
```

### 2. Development Commands

```bash
# Development server
npm start             # Hot reload development server

# Testing
npm test             # Run test suite in watch mode
npm run test:coverage # Run tests with coverage report

# Production build
npm run build        # Create optimized production build
npm run build:analyze # Analyze bundle size

# Code quality
npm run lint         # ESLint code checking
npm run format       # Prettier code formatting
```

### 3. Git Workflow

```bash
# Feature development
git checkout -b feature/new-component
git add .
git commit -m "feat: add new navigation component"
git push origin feature/new-component

# Create pull request for code review
```

### 4. API Development Cycle

1. **Define API Contract**: Document expected request/response formats
2. **Mock API Responses**: Develop frontend with mock data
3. **Integrate Backend**: Connect to real Spring Boot endpoints  
4. **Error Handling**: Implement proper error states and loading indicators
5. **Testing**: Unit tests for API service functions

---

## Best Practices & Conventions

### 1. Component Development

#### Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Files**: PascalCase for components, camelCase for utilities
- **Props**: Descriptive names (`isLoggedIn` not `loggedIn`)

#### Component Structure
```typescript
// Standard component template
interface ComponentProps {
  // Define props with TypeScript
}

const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Hooks at the top
  const [state, setState] = useState('');
  const dispatch = useDispatch();
  
  // Event handlers
  const handleAction = () => {
    // Handle user interactions
  };
  
  // Render method
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### 2. State Management

#### Redux Best Practices
- **Normalize State**: Avoid nested objects, use flat structures
- **Feature-Based Slices**: Organize by domain, not by data type
- **Async Thunks**: Use RTK Query for complex API interactions

#### Local vs Global State
- **Global State**: Authentication, user preferences, shared data
- **Local State**: Form inputs, UI toggles, temporary data

### 3. API Integration

#### Error Handling Strategy
```typescript
try {
  const response = await apiCall();
  // Handle success
} catch (error) {
  // Log error for debugging
  console.error('API Error:', error);
  
  // Show user-friendly error message
  setError('Something went wrong. Please try again.');
  
  // Optional: Report to error tracking service
}
```

#### Loading States
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const fetchData = async () => {
  setLoading(true);
  setError('');
  try {
    const data = await apiCall();
    // Handle success
  } catch (err) {
    setError('Failed to load data');
  } finally {
    setLoading(false);
  }
};
```

### 4. TypeScript Guidelines

#### Interface Definitions
```typescript
// API response types
interface ChannelResponse {
  id: number;
  name: string;
  createdAt: string;
  adminId: number;
}

// Component props
interface ChannelItemProps {
  channel: ChannelResponse;
  isActive: boolean;
  onClick: (channelId: number) => void;
}
```

#### Type Safety
- Use strict TypeScript configuration
- Avoid `any` type, prefer `unknown` for dynamic content
- Define interfaces for all API responses
- Use union types for component variants

### 5. Performance Optimization

#### React Optimization
```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// Memoize callbacks to prevent unnecessary re-renders
const handleClick = useCallback((id: number) => {
  // Handle click logic
}, [dependency]);

// Lazy load route components
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
```

#### Bundle Optimization
- **Code Splitting**: Lazy load route components
- **Tree Shaking**: Import only needed utilities
- **Image Optimization**: Use appropriate formats and sizes

### 6. Testing Strategy

#### Component Testing
```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import LoginScreen from '../LoginScreen';

test('submits login form with correct data', () => {
  render(
    <Provider store={mockStore}>
      <LoginScreen />
    </Provider>
  );
  
  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.click(screen.getByText('Login'));
  
  expect(mockApiCall).toHaveBeenCalledWith('test@example.com', 'password');
});
```

#### API Testing
- Mock API responses for reliable testing
- Test error handling scenarios
- Verify loading states and user feedback

---

## Security Considerations

### 1. Authentication Security
- **JWT Token Storage**: Consider httpOnly cookies vs localStorage
- **Token Expiration**: Implement automatic token refresh
- **Route Protection**: Prevent unauthorized access to protected routes

### 2. Input Validation
- **Client-Side Validation**: Immediate user feedback
- **Server-Side Validation**: Security and data integrity
- **XSS Prevention**: Sanitize user inputs and API responses

### 3. API Security
- **HTTPS**: Ensure all API calls use secure protocols
- **CORS Configuration**: Properly configure backend CORS settings
- **Error Handling**: Don't expose sensitive information in error messages

---

## Future Enhancements

### 1. Real-Time Features
- **WebSocket Integration**: Real-time messaging and notifications
- **Presence System**: Show online/offline user status
- **Typing Indicators**: Show when users are typing

### 2. Advanced Features
- **File Uploads**: Share images and documents
- **Voice Channels**: Audio communication
- **Screen Sharing**: Collaborative features

### 3. Performance & Scalability
- **Virtual Scrolling**: Handle large message lists
- **Caching Strategy**: Optimize API calls and data persistence  
- **PWA Features**: Offline support and push notifications

### 4. User Experience
- **Dark/Light Themes**: Customizable UI themes
- **Keyboard Shortcuts**: Power user features
- **Accessibility**: WCAG compliance and screen reader support

---

This documentation provides a comprehensive overview of the Discord Clone project architecture, implementation details, and development guidelines. It serves as a reference for team members to understand the codebase structure, make informed development decisions, and maintain consistency across the project.