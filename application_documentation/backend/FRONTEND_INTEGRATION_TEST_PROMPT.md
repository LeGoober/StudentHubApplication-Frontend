# StudentHub Frontend-Backend Integration Test Prompt

## Context
This prompt aligns the StudentHub Spring Boot backend with the React Discord clone frontend expectations. Use this to create comprehensive integration tests that verify complete end-to-end functionality.

## Backend-Frontend Compatibility Analysis

### ✅ IMPLEMENTED CORRECTLY
- Base URL: `http://localhost:8080`
- JWT Authentication with Bearer tokens
- CORS configured for `http://localhost:3000`
- WebSocket support with STOMP
- User registration and login endpoints
- Channel CRUD operations
- Message system with pagination
- User presence tracking

### ❌ NEEDS ALIGNMENT
- **Authentication payload mismatch**: Frontend expects `{username, password}`, backend uses `{userEmail, userPassword}`
- **Response format**: Frontend expects JWT + user object, backend returns only JWT
- **WebSocket authentication**: Frontend expects `?token=` query param, backend uses headers
- **Channel model**: Frontend expects `isPrivate` boolean, backend uses `channelType` enum
- **User model fields**: Frontend expects `{username, email, avatar}`, backend has `{userEmail, userFirstName, userLastName}`

## Updated Testing Prompt

```
Create a comprehensive integration test suite for the StudentHub Discord clone that bridges the gap between the React frontend expectations and the current Spring Boot backend implementation. The backend needs these modifications to align with frontend requirements:

## CRITICAL BACKEND ADJUSTMENTS NEEDED:

### 1. Authentication System Updates
**Current Backend**: POST `/auth/login` accepts `{userEmail, userPassword}`
**Frontend Expects**: POST `/auth/login` accepts `{username, password}`

**FIX REQUIRED**: 
- Update login endpoint to accept `username` field (map to userEmail)
- Return both JWT token AND user object: `{token: "jwt-here", user: {...}}`
- Add username field to User model or use email as username

### 2. User Model Alignment
**Current Backend User Fields**: `{userId, userFirstName, userLastName, userEmail, userRole, status, isOnline}`
**Frontend Expected Fields**: `{id, username, email, avatar, status, createdAt, lastSeen}`

**FIX REQUIRED**:
```json
{
  "id": "userId",
  "username": "userEmail", // or create separate username field
  "email": "userEmail", 
  "displayName": "userFirstName + userLastName",
  "avatar": "default-avatar-url", // add avatar field
  "status": "status",
  "isOnline": "isOnline",
  "createdAt": "add timestamp",
  "lastSeen": "add timestamp"
}
```

### 3. Channel Model Updates
**Current Backend**: Uses `channelType` enum (PUBLIC, PRIVATE)
**Frontend Expects**: Boolean `isPrivate` field

**FIX REQUIRED**: Add converter or modify Channel to include `isPrivate` boolean field

### 4. WebSocket Authentication
**Current**: Uses header-based JWT authentication
**Frontend Expects**: Query parameter authentication `?token={jwt}`

**FIX REQUIRED**: Update WebSocket handshake to accept token via query parameter

### 5. Message Format Standardization
**Current**: Returns Message entities directly
**Frontend Expects**: Specific message format with author details embedded

## REQUIRED API ENDPOINTS (Backend Implementation Status):

### Authentication (/auth) ✅ IMPLEMENTED
- POST /auth/login ⚠️ NEEDS FIX - Accept `{username, password}` instead of `{userEmail, userPassword}`
- POST /auth/register ⚠️ NEEDS FIX - Return `{token, user}` object instead of just token
- GET /auth/get/{id} ✅ WORKING
- PUT /auth/update ✅ WORKING  
- DELETE /auth/delete/{id} ✅ WORKING
- GET /auth/getAll ✅ WORKING

### User Status (/users) ✅ IMPLEMENTED
- GET /users/online?channelId={id} ✅ WORKING
- PATCH /users/status ✅ WORKING

### Channels (/channel) ⚠️ PARTIALLY IMPLEMENTED
- GET /channel/getAll ✅ WORKING (frontend expects this exact endpoint)
- POST /channel/create ⚠️ NEEDS FIX - Add `isPrivate` boolean field support
- GET /channel/read/{id} ✅ WORKING
- PUT /channel/update ⚠️ NEEDS FIX - Support `isPrivate` field
- DELETE /channel/delete/{id} ✅ WORKING
- POST /channel/join/{channelId} ✅ WORKING
- DELETE /channel/leave/{channelId} ✅ WORKING  
- GET /channel/{channelId}/members ✅ WORKING

### Messages (/messages) ✅ IMPLEMENTED
- GET /messages/{channelId}?page={page}&size={size} ✅ WORKING (default size should be 20, not 50)
- POST /messages/send ⚠️ NEEDS FIX - Frontend expects `{channelId, content}`, not `authorId`
- PUT /messages/{messageId} ✅ WORKING
- DELETE /messages/{messageId} ✅ WORKING

### WebSocket Real-Time ⚠️ NEEDS MAJOR UPDATES
**Current Backend WebSocket**: `/ws` with STOMP
**Frontend Expected Messages**:
- `message` - Real-time chat messages ✅ IMPLEMENTED
- `user_joined` - User joined channel ✅ IMPLEMENTED  
- `user_left` - User left channel ❌ MISSING
- `typing` - Typing indicators ✅ IMPLEMENTED
- `online_users` - User presence updates ✅ IMPLEMENTED
- `ping` - Heartbeat for connection health ❌ MISSING
- `join_channel` - Channel join events ❌ MISSING
- `leave_channel` - Channel leave events ❌ MISSING

**CRITICAL**: Frontend expects WebSocket auth via `?token={jwt}` query parameter, not headers!

## INTEGRATION TEST REQUIREMENTS:

### 1. Authentication Tests ⚠️ CRITICAL FIXES NEEDED
**Current Login Format**: `{userEmail, userPassword}`
**Required Frontend Format**: `{username, password}`

**Test Cases**:
- Login with username/password (map username to userEmail internally)
- Verify response contains `{token: "jwt", user: {id, username, email, displayName, avatar, status}}`
- Registration returns same format
- JWT token validation on protected routes

### 2. WebSocket Connection Tests ❌ MAJOR FIXES NEEDED
**Current**: Header-based JWT authentication  
**Required**: Query parameter authentication `ws://localhost:8080/ws?token={jwt}`

**Test Cases**:
- Establish connection with `?token=` parameter
- Send/receive real-time messages
- Test typing indicators
- Test user join/leave notifications  
- Test ping/heartbeat system
- Test connection cleanup on token expiry

### 3. Channel Management Tests ⚠️ MINOR FIXES NEEDED
**Current**: `channelType` enum (PUBLIC/PRIVATE)
**Required**: `isPrivate` boolean field

**Test Cases**:
- Create channel with `{name, description, isPrivate: true/false}`
- Update channel privacy settings
- Join/leave channels and see real-time member updates
- List all accessible channels

### 4. Message System Tests ✅ MOSTLY WORKING
**Minor Fix**: Default page size should be 20, not 50

**Test Cases**:
- Send message with `{channelId, content}` (no authorId needed - get from JWT)
- Receive real-time message updates via WebSocket
- Edit/delete own messages
- Paginated message history (20 messages per page)

### 5. User Presence Tests ⚠️ ALIGNMENT NEEDED
**Test Cases**:
- Update user status (online/away/busy/invisible)
- Real-time online user updates
- User typing indicators
- Connection heartbeat and automatic cleanup

## REQUIRED DATA STRUCTURE FIXES:

### Frontend Expected Login Request:
```json
{
  "username": "john@example.com",  // Map this to userEmail in backend
  "password": "password123"
}
```

### Frontend Expected Login Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "john@example.com",
    "email": "john@example.com", 
    "displayName": "John Doe",
    "avatar": "https://defaultavatar.com/john.png",
    "status": "online",
    "isOnline": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "lastSeen": "2024-01-01T12:00:00Z"
  }
}
```

### Frontend Expected Channel Format:
```json
{
  "id": 1,
  "name": "General Discussion",
  "description": "Main discussion channel",
  "isPrivate": false,  // Not channelType enum!
  "createdBy": 1,
  "members": [1, 2, 3],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Frontend Expected Message Format:
```json
{
  "id": 1,
  "content": "Hello World!",
  "author": {
    "id": 1,
    "username": "john@example.com",
    "displayName": "John Doe",
    "avatar": "https://defaultavatar.com/john.png",
    "isOnline": true
  },
  "channelId": 1,
  "timestamp": "2024-01-01T12:00:00Z",
  "isEdited": false,
  "editedAt": null
}
```

### Frontend Expected WebSocket Message Types:
```javascript
// Message received
{type: "message", payload: {...message}, timestamp: "ISO8601"}

// User joined
{type: "user_joined", payload: {userId, username, channelId}, timestamp: "ISO8601"}

// User left  
{type: "user_left", payload: {userId, username, channelId}, timestamp: "ISO8601"}

// Typing indicator
{type: "typing", payload: {userId, username, channelId, isTyping: true/false}, timestamp: "ISO8601"}

// Online users update
{type: "online_users", payload: {channelId, users: [...]}, timestamp: "ISO8601"}

// Heartbeat
{type: "ping", payload: {}, timestamp: "ISO8601"}
```

Create comprehensive tests that verify these exact formats and fix any backend discrepancies. Include setup instructions and error handling verification.
```

## Additional Notes

- **Database**: The backend uses MySQL database
- **Security**: All authenticated endpoints require `Authorization: Bearer <token>` header
- **Error Handling**: Backend returns appropriate HTTP status codes and error messages
- **Real-time**: WebSocket connection required for live chat functionality
- **Pagination**: Messages are paginated (default 50 per page)
- **CORS**: Pre-configured for React development server on port 3000

## Expected Test Coverage

The tests should verify:
1. Complete user authentication flow
2. Real-time messaging functionality  
3. Channel management operations
4. User presence and status tracking
5. Product CRUD operations
6. Error handling and edge cases
7. Token-based security
8. WebSocket connectivity and messaging

This comprehensive test suite will ensure your React frontend properly integrates with all backend services and handles both success and error scenarios appropriately.
