# StudentHub Frontend-Backend Integration Checklist

## Current Implementation Status

### ✅ WORKING CORRECTLY ✨ **ENHANCED**
- [x] Backend server runs on `http://localhost:8080`
- [x] CORS configured for `http://localhost:3000`
- [x] JWT-based authentication implemented
- [x] WebSocket support with STOMP protocol for real-time messaging
- [x] Complete CRUD operations for Users, Channels, Messages, Profiles, Posts, Products
- [x] User presence tracking (online/offline status)
- [x] Message pagination support (20 per page default)
- [x] **FIXED:** Channel join/leave functionality with proper HashSet management
- [x] **ENHANCED:** Real-time messaging via WebSocket with proper notifications
- [x] **NEW:** Channel membership management (admin/member roles)
- [x] **NEW:** Message editing and deletion with proper permissions
- [x] **NEW:** User profile management system
- [x] **NEW:** Entrepreneur profile support
- [x] **NEW:** Product marketplace functionality
- [x] **NEW:** User post creation and content search
- [x] **COMPREHENSIVE:** API documentation and Postman collection

### ⚠️ NEEDS ALIGNMENT/FIXES

#### HIGH PRIORITY (Breaking Issues)
- [ ] **Authentication Payload Mismatch**
  - Current: `{userEmail, userPassword}`
  - Required: `{username, password}`
  - Impact: Frontend login forms won't work

- [ ] **Authentication Response Format**
  - Current: Returns only JWT token string
  - Required: `{token: "jwt", user: {...}}`
  - Impact: Frontend can't access user data after login

- [ ] **WebSocket Authentication Method**
  - Current: Header-based JWT authentication
  - Required: Query parameter `?token={jwt}`
  - Impact: WebSocket connections will fail

- [ ] **User Model Field Mapping**
  - Missing: `username`, `avatar`, `displayName`, `createdAt`, `lastSeen`
  - Current: `userId, userFirstName, userLastName, userEmail, userRole`
  - Impact: Frontend UI components can't display user info properly

#### MEDIUM PRIORITY (Feature Gaps)
- [ ] **Channel Model Updates**
  - Current: `channelType` enum (PUBLIC, PRIVATE)
  - Required: `isPrivate` boolean field
  - Impact: Channel privacy settings won't work correctly

- [ ] **Message Format Standardization**
  - Missing: Embedded author details in message responses
  - Required: Full author object with avatar, displayName, etc.
  - Impact: Message display will be incomplete

- [ ] **WebSocket Message Types**
  - Missing: `user_left`, `ping`, `join_channel`, `leave_channel` events
  - Impact: Limited real-time functionality

- [ ] **Default Pagination Size**
  - Current: 50 messages per page
  - Required: 20 messages per page
  - Impact: UI might not handle large message loads well

#### LOW PRIORITY (Enhancements)
- [ ] **Product Management Integration**
  - Backend implemented but not aligned with Discord clone frontend
  - May not be needed for Discord clone functionality

- [ ] **User Role System Alignment**
  - Backend supports complex roles (STUDENT, FACULTY, etc.)
  - Frontend might expect simpler user/admin roles

### ❌ MISSING FEATURES

- [ ] **Avatar Management System**
  - No avatar field in User model
  - No avatar upload/management endpoints
  - Frontend expects avatar URLs

- [ ] **Message Editing History**
  - No `isEdited` or `editedAt` fields in Message model
  - Frontend expects edit tracking

- [ ] **Channel Description Field**
  - Channel model may be missing description field
  - Frontend expects channel descriptions

- [ ] **Connection Heartbeat System**
  - No ping/pong system for WebSocket health
  - Frontend expects heartbeat messages

- [ ] **User Last Seen Tracking**
  - No automatic last seen timestamp updates
  - Frontend expects last seen information

## Required Backend Code Changes

### 1. Update UserController Login Method
```java
@PostMapping("/login")
public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
    // Map username to userEmail
    String email = request.getUsername(); // or lookup username if separate field exists
    
    User user = userService.findByUserEmail(email);
    if (user != null && passwordEncoder.matches(request.getPassword(), user.getUserPassword())) {
        String token = jwtUtil.generateToken(user.getUserEmail());
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", formatUserForFrontend(user));
        
        return ResponseEntity.ok(response);
    }
    return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
}
```

### 2. Add User Formatting Method
```java
private Map<String, Object> formatUserForFrontend(User user) {
    Map<String, Object> userInfo = new HashMap<>();
    userInfo.put("id", user.getId());
    userInfo.put("username", user.getUserEmail()); // or separate username field
    userInfo.put("email", user.getUserEmail());
    userInfo.put("displayName", user.getUserFirstName() + " " + user.getUserLastName());
    userInfo.put("avatar", "https://defaultavatar.com/avatar.png"); // placeholder
    userInfo.put("status", user.getStatus());
    userInfo.put("isOnline", user.isOnline());
    userInfo.put("createdAt", Instant.now().toString()); // add actual timestamp
    userInfo.put("lastSeen", Instant.now().toString()); // add actual timestamp
    return userInfo;
}
```

### 3. Update WebSocket Configuration
```java
// In WebSocketConfig.java
@Override
public void configureStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws")
            .setAllowedOrigins("http://localhost:3000")
            .setHandshakeHandler(new DefaultHandshakeHandler() {
                @Override
                public boolean beforeHandshake(
                    ServerHttpRequest request,
                    ServerHttpResponse response,
                    WebSocketHandler wsHandler,
                    Map<String, Object> attributes) throws Exception {
                    
                    // Extract token from query parameter
                    String query = request.getURI().getQuery();
                    if (query != null && query.contains("token=")) {
                        String token = extractTokenFromQuery(query);
                        // Validate token and set user in attributes
                        return validateTokenAndSetUser(token, attributes);
                    }
                    return false;
                }
            })
            .withSockJS();
}
```

### 4. Add Channel isPrivate Field
```java
// In Channel.java entity
@Column(name = "is_private")
private boolean isPrivate = false;

// Add getter/setter and update create/update endpoints to handle this field
```

### 5. Update Message Response Format
```java
// In MessageController.java
private Map<String, Object> formatMessageForFrontend(Message message) {
    Map<String, Object> messageInfo = new HashMap<>();
    messageInfo.put("id", message.getId());
    messageInfo.put("content", message.getContent());
    messageInfo.put("channelId", message.getChannel().getChannelId());
    messageInfo.put("timestamp", message.getTimestamp().toString());
    messageInfo.put("isEdited", false); // add isEdited field to Message entity
    messageInfo.put("editedAt", null);
    
    // Embedded author details
    Map<String, Object> authorInfo = formatUserForFrontend(message.getAuthor());
    messageInfo.put("author", authorInfo);
    
    return messageInfo;
}
```

## Testing Priority Order

### Phase 1: Critical Authentication Fixes
1. Fix login payload format (`username` instead of `userEmail`)
2. Fix login response format (return `{token, user}` object)
3. Test authentication flow end-to-end

### Phase 2: WebSocket Connection
1. Update WebSocket auth to use query parameters
2. Test WebSocket connection establishment
3. Test basic real-time messaging

### Phase 3: Data Format Alignment
1. Update user data format
2. Update message data format
3. Update channel data format
4. Test all CRUD operations

### Phase 4: Complete Feature Set
1. Add missing WebSocket message types
2. Implement heartbeat system
3. Add missing fields (avatar, isEdited, etc.)
4. Test complete Discord clone functionality

## Success Criteria

### Authentication Working ✓
- [ ] Can login with `{username, password}`
- [ ] Receives `{token, user}` response
- [ ] JWT token works on protected routes
- [ ] User data displays correctly in frontend

### WebSocket Working ✓
- [ ] Connection established with `?token=` parameter
- [ ] Real-time messages work
- [ ] Typing indicators work
- [ ] User presence updates work
- [ ] Heartbeat system maintains connection

### UI Integration Working ✓
- [ ] Login form works
- [ ] Channel list displays
- [ ] Can create/join channels
- [ ] Messages display with user info
- [ ] Real-time updates visible in UI

### Error Handling Working ✓
- [ ] Invalid credentials show error
- [ ] Expired tokens handled gracefully
- [ ] Missing fields validated
- [ ] Network errors don't break UI

## Next Steps

1. **Start with High Priority fixes** - These are blocking the basic functionality
2. **Use the updated test prompt** with your React frontend AmpCode instance
3. **Test each fix incrementally** - Don't try to fix everything at once
4. **Document any additional issues found** during testing
5. **Create proper error handling** for all edge cases

This checklist should guide you through making your backend fully compatible with the Discord clone React frontend expectations.
