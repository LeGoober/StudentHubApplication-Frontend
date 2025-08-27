# Backend Integration Requirements for Enhanced Discord Clone Features

## Overview
This document outlines the required backend changes to support the enhanced frontend features including friend system, improved channel membership, and WebSocket connectivity improvements.

## Current Issues to Resolve
1. **WebSocket Connection**: "Reconnecting to chat" errors
2. **Channel Membership**: "Failed to update membership" when joining channels
3. **Missing Friend System**: Complete friend/follow functionality
4. **Online User Tracking**: Real-time user presence

## Required Database Entities

### 1. User Entity Enhancements
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String userEmail;
    private String userFirstName;
    private String userLastName;
    private String userPassword; // encrypted
    private String userRole;
    private String studentNumber; // nullable
    private String staffNumber; // nullable
    
    // New fields for enhanced functionality
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private UserStatus status = UserStatus.OFFLINE;
    
    @Column(name = "last_seen")
    private LocalDateTime lastSeen;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Column(name = "is_online")
    private Boolean isOnline = false;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "fromUser", cascade = CascadeType.ALL)
    private List<Friendship> sentFriendRequests = new ArrayList<>();
    
    @OneToMany(mappedBy = "toUser", cascade = CascadeType.ALL)
    private List<Friendship> receivedFriendRequests = new ArrayList<>();
    
    // Getters and setters...
}

public enum UserStatus {
    ONLINE, AWAY, BUSY, INVISIBLE, OFFLINE
}
```

### 2. Friendship Entity (New)
```java
@Entity
@Table(name = "friendships")
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user_id", nullable = false)
    private User fromUser;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_user_id", nullable = false)
    private User toUser;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private FriendshipStatus status = FriendshipStatus.PENDING;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Getters and setters...
}

public enum FriendshipStatus {
    PENDING, ACCEPTED, REJECTED, BLOCKED
}
```

### 3. Enhanced Channel Membership Entity
```java
@Entity
@Table(name = "channel_memberships")
public class ChannelMembership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channel_id", nullable = false)
    private Channel channel;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private ChannelRole role = ChannelRole.MEMBER;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @CreationTimestamp
    private LocalDateTime joinedAt;
    
    @Column(name = "left_at")
    private LocalDateTime leftAt;
    
    // Getters and setters...
}

public enum ChannelRole {
    ADMIN, MODERATOR, MEMBER
}
```

### 4. Enhanced Channel Entity
```java
@Entity
@Table(name = "channels")
public class Channel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "channel_name", nullable = false)
    private String channelNameField;
    
    @Column(name = "channel_type", nullable = false)
    private String channelTypeField;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "is_private")
    private Boolean isPrivate = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "channel", cascade = CascadeType.ALL)
    private List<ChannelMembership> memberships = new ArrayList<>();
    
    @OneToMany(mappedBy = "channel", cascade = CascadeType.ALL)
    private List<Message> messages = new ArrayList<>();
    
    // Helper method to get active members count
    public long getActiveMemberCount() {
        return memberships.stream()
            .filter(m -> m.getIsActive())
            .count();
    }
    
    // Getters and setters...
}
```

## Required REST API Endpoints

### 1. Friend Management Endpoints
```java
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class FriendshipController {
    
    // Get user's friends
    @GetMapping("/friends")
    public ResponseEntity<List<FriendDto>> getFriends(Authentication auth) {
        // Return list of accepted friends with online status
    }
    
    // Send friend request
    @PostMapping("/friend-request")
    public ResponseEntity<MessageResponse> sendFriendRequest(
        @RequestBody FriendRequestDto request, Authentication auth) {
        // Create PENDING friendship record
    }
    
    // Accept friend request
    @PostMapping("/friend-request/accept")
    public ResponseEntity<MessageResponse> acceptFriendRequest(
        @RequestBody FriendRequestDto request, Authentication auth) {
        // Update friendship status to ACCEPTED
    }
    
    // Reject friend request
    @PostMapping("/friend-request/reject")
    public ResponseEntity<MessageResponse> rejectFriendRequest(
        @RequestBody FriendRequestDto request, Authentication auth) {
        // Update friendship status to REJECTED
    }
    
    // Get pending friend requests
    @GetMapping("/friend-requests")
    public ResponseEntity<List<FriendRequestDto>> getFriendRequests(Authentication auth) {
        // Return pending friend requests received by user
    }
    
    // Remove friend
    @DeleteMapping("/friends/{userId}")
    public ResponseEntity<MessageResponse> removeFriend(
        @PathVariable Long userId, Authentication auth) {
        // Delete friendship record or set status to BLOCKED
    }
    
    // Search users
    @GetMapping("/search")
    public ResponseEntity<List<UserSearchDto>> searchUsers(
        @RequestParam("q") String query, Authentication auth) {
        // Return users matching query with friendship status
    }
    
    // Block user
    @PostMapping("/block")
    public ResponseEntity<MessageResponse> blockUser(
        @RequestBody BlockUserDto request, Authentication auth) {
        // Set friendship status to BLOCKED
    }
    
    // Unblock user
    @DeleteMapping("/block/{userId}")
    public ResponseEntity<MessageResponse> unblockUser(
        @PathVariable Long userId, Authentication auth) {
        // Remove BLOCKED friendship record
    }
}
```

### 2. Enhanced Channel Membership Endpoints
```java
@RestController
@RequestMapping("/channel")
@CrossOrigin(origins = "*")
public class ChannelMembershipController {
    
    // Join channel (FIXED)
    @PostMapping("/join/{channelId}")
    public ResponseEntity<MessageResponse> joinChannel(
        @PathVariable Long channelId, Authentication auth) {
        try {
            User user = getCurrentUser(auth);
            Channel channel = channelService.findById(channelId);
            
            // Check if already a member
            Optional<ChannelMembership> existingMembership = 
                membershipService.findByUserAndChannel(user, channel);
            
            if (existingMembership.isPresent()) {
                if (existingMembership.get().getIsActive()) {
                    return ResponseEntity.badRequest()
                        .body(new MessageResponse("Already a member"));
                } else {
                    // Reactivate membership
                    existingMembership.get().setIsActive(true);
                    existingMembership.get().setLeftAt(null);
                    membershipService.save(existingMembership.get());
                }
            } else {
                // Create new membership
                ChannelMembership membership = new ChannelMembership();
                membership.setUser(user);
                membership.setChannel(channel);
                membership.setRole(ChannelRole.MEMBER);
                membership.setIsActive(true);
                membershipService.save(membership);
            }
            
            // Send WebSocket notification
            websocketService.sendChannelUpdate(channelId, "user_joined", user);
            
            return ResponseEntity.ok(new MessageResponse("Successfully joined channel"));
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(new MessageResponse("Failed to join channel: " + e.getMessage()));
        }
    }
    
    // Leave channel
    @DeleteMapping("/leave/{channelId}")
    public ResponseEntity<MessageResponse> leaveChannel(
        @PathVariable Long channelId, Authentication auth) {
        // Set membership isActive to false, set leftAt timestamp
    }
    
    // Get channel members with online status
    @GetMapping("/{channelId}/members")
    public ResponseEntity<List<ChannelMemberDto>> getChannelMembers(
        @PathVariable Long channelId) {
        // Return active members with online status and roles
    }
    
    // Check membership status
    @GetMapping("/check-membership/{channelId}")
    public ResponseEntity<MembershipStatusDto> checkMembership(
        @PathVariable Long channelId, Authentication auth) {
        // Return user's membership status for the channel
    }
    
    // Get online users (global or by channel)
    @GetMapping("/online-users")
    public ResponseEntity<List<OnlineUserDto>> getOnlineUsers(
        @RequestParam(required = false) Long channelId) {
        // Return online users, optionally filtered by channel
    }
}
```

### 3. User Status Management
```java
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserStatusController {
    
    // Update user status
    @PatchMapping("/status")
    public ResponseEntity<MessageResponse> updateStatus(
        @RequestBody UserStatusDto request, Authentication auth) {
        User user = getCurrentUser(auth);
        user.setStatus(UserStatus.valueOf(request.getStatus().toUpperCase()));
        user.setLastSeen(LocalDateTime.now());
        
        if (request.getStatus().equals("ONLINE")) {
            user.setIsOnline(true);
        } else {
            user.setIsOnline(false);
        }
        
        userService.save(user);
        
        // Broadcast status change via WebSocket
        websocketService.broadcastUserStatusChange(user);
        
        return ResponseEntity.ok(new MessageResponse("Status updated"));
    }
    
    // Get online users
    @GetMapping("/online")
    public ResponseEntity<List<OnlineUserDto>> getOnlineUsers(
        @RequestParam(required = false) Long channelId) {
        List<User> onlineUsers;
        
        if (channelId != null) {
            // Get online users in specific channel
            onlineUsers = userService.findOnlineUsersByChannel(channelId);
        } else {
            // Get all online users
            onlineUsers = userService.findOnlineUsers();
        }
        
        List<OnlineUserDto> dtos = onlineUsers.stream()
            .map(this::mapToOnlineUserDto)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(dtos);
    }
}
```

## Required DTOs

### Friend-related DTOs
```java
public class FriendDto {
    private Long id;
    private String name;
    private String email;
    private Boolean isOnline;
    private String status; // ONLINE, AWAY, BUSY, etc.
    private String avatarUrl;
    private LocalDateTime lastSeen;
    // getters and setters
}

public class FriendRequestDto {
    private Long userId;
    private Long fromUserId;
    private String fromUserName;
    private String fromUserEmail;
    private Long toUserId;
    private String status;
    private LocalDateTime createdAt;
    // getters and setters
}

public class UserSearchDto {
    private Long id;
    private String name;
    private String email;
    private Boolean isOnline;
    private Boolean isFriend;
    private Boolean requestSent;
    private String avatarUrl;
    // getters and setters
}
```

### Channel-related DTOs
```java
public class ChannelMemberDto {
    private Long id;
    private String name;
    private String email;
    private Boolean isOnline;
    private String role; // ADMIN, MODERATOR, MEMBER
    private LocalDateTime joinedAt;
    private String avatarUrl;
    private String status;
    // getters and setters
}

public class MembershipStatusDto {
    private Boolean isMember;
    private String role;
    private LocalDateTime joinedAt;
    private Boolean isActive;
    // getters and setters
}

public class OnlineUserDto {
    private Long id;
    private String name;
    private String status;
    private LocalDateTime lastSeen;
    private String avatarUrl;
    // getters and setters
}
```

## Enhanced WebSocket Configuration

### 1. WebSocket Message Types
```java
public enum WebSocketMessageType {
    MESSAGE,
    USER_JOINED,
    USER_LEFT,
    TYPING,
    ONLINE_USERS,
    USER_STATUS_CHANGE,
    FRIEND_REQUEST,
    FRIEND_REQUEST_ACCEPTED,
    CHANNEL_JOINED,
    CHANNEL_LEFT,
    PING,
    PONG
}
```

### 2. WebSocket Controller Enhancements
```java
@Controller
@CrossOrigin(origins = "*")
public class WebSocketController {
    
    @MessageMapping("/join-channel")
    @SendTo("/topic/channel/{channelId}")
    public WebSocketMessage joinChannel(
        @DestinationVariable Long channelId,
        @Payload JoinChannelMessage message,
        SimpMessageHeaderAccessor headerAccessor) {
        
        // Update user session with channel
        String sessionId = headerAccessor.getSessionId();
        websocketSessionService.addUserToChannel(sessionId, channelId);
        
        // Update online status
        User user = getCurrentUser(headerAccessor);
        user.setIsOnline(true);
        user.setLastSeen(LocalDateTime.now());
        userService.save(user);
        
        // Broadcast user joined
        WebSocketMessage response = new WebSocketMessage();
        response.setType(WebSocketMessageType.USER_JOINED);
        response.setPayload(Map.of(
            "userId", user.getId(),
            "userName", user.getUserFirstName() + " " + user.getUserLastName(),
            "channelId", channelId
        ));
        
        // Send updated online users list
        broadcastOnlineUsers(channelId);
        
        return response;
    }
    
    @MessageMapping("/send-message")
    public void sendMessage(@Payload ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {
        // Enhanced message handling with better error handling
        try {
            User user = getCurrentUser(headerAccessor);
            
            // Validate channel membership
            if (!channelMembershipService.isUserMemberOfChannel(user.getId(), message.getChannelId())) {
                sendErrorToUser(headerAccessor.getSessionId(), "Not a member of this channel");
                return;
            }
            
            // Save message to database
            Message savedMessage = messageService.saveMessage(message, user);
            
            // Broadcast to channel
            WebSocketMessage wsMessage = new WebSocketMessage();
            wsMessage.setType(WebSocketMessageType.MESSAGE);
            wsMessage.setPayload(mapToChatMessageDto(savedMessage));
            
            simpMessagingTemplate.convertAndSend(
                "/topic/channel/" + message.getChannelId(), 
                wsMessage
            );
            
        } catch (Exception e) {
            logger.error("Error sending message: ", e);
            sendErrorToUser(headerAccessor.getSessionId(), "Failed to send message");
        }
    }
    
    private void broadcastOnlineUsers(Long channelId) {
        List<OnlineUserDto> onlineUsers = userService.getOnlineUsersByChannel(channelId);
        
        WebSocketMessage message = new WebSocketMessage();
        message.setType(WebSocketMessageType.ONLINE_USERS);
        message.setPayload(Map.of("users", onlineUsers));
        
        simpMessagingTemplate.convertAndSend("/topic/channel/" + channelId, message);
    }
    
    private void sendErrorToUser(String sessionId, String errorMessage) {
        WebSocketMessage errorMsg = new WebSocketMessage();
        errorMsg.setType(WebSocketMessageType.ERROR);
        errorMsg.setPayload(Map.of("message", errorMessage));
        
        simpMessagingTemplate.convertAndSendToUser(
            sessionId, "/queue/errors", errorMsg
        );
    }
}
```

### 3. Connection Event Handlers
```java
@Component
public class WebSocketEventListener {
    
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info("New WebSocket connection: {}", event.getMessage());
        
        // Extract user from connection
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String token = extractTokenFromHeaders(headerAccessor);
        
        if (token != null) {
            try {
                User user = jwtService.getUserFromToken(token);
                user.setIsOnline(true);
                user.setLastSeen(LocalDateTime.now());
                userService.save(user);
                
                // Store session info
                websocketSessionService.addUserSession(headerAccessor.getSessionId(), user);
                
                logger.info("User {} connected via WebSocket", user.getUserEmail());
            } catch (Exception e) {
                logger.error("Failed to authenticate WebSocket connection: ", e);
            }
        }
    }
    
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        
        // Get user from session
        User user = websocketSessionService.getUserBySession(sessionId);
        if (user != null) {
            // Update offline status
            user.setIsOnline(false);
            user.setLastSeen(LocalDateTime.now());
            userService.save(user);
            
            // Remove from all channels and broadcast updates
            List<Long> userChannels = websocketSessionService.getUserChannels(sessionId);
            for (Long channelId : userChannels) {
                broadcastUserLeft(channelId, user);
                broadcastOnlineUsers(channelId);
            }
            
            // Clean up session
            websocketSessionService.removeUserSession(sessionId);
            
            logger.info("User {} disconnected from WebSocket", user.getUserEmail());
        }
    }
}
```

## Database Migration Scripts

### For MySQL/PostgreSQL:
```sql
-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN status VARCHAR(20) DEFAULT 'OFFLINE',
ADD COLUMN last_seen TIMESTAMP NULL,
ADD COLUMN avatar_url VARCHAR(500) NULL,
ADD COLUMN is_online BOOLEAN DEFAULT FALSE,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Create friendships table
CREATE TABLE friendships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_user_id BIGINT NOT NULL,
    to_user_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_friendship (from_user_id, to_user_id)
);

-- Create channel_memberships table
CREATE TABLE channel_memberships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    channel_id BIGINT NOT NULL,
    role VARCHAR(20) DEFAULT 'MEMBER',
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE,
    UNIQUE KEY unique_membership (user_id, channel_id)
);

-- Add columns to channels table
ALTER TABLE channels 
ADD COLUMN is_private BOOLEAN DEFAULT FALSE,
ADD COLUMN created_by BIGINT NULL,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD FOREIGN KEY (created_by) REFERENCES users(id);

-- Indexes for performance
CREATE INDEX idx_users_online ON users(is_online);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_friendships_from_user ON friendships(from_user_id);
CREATE INDEX idx_friendships_to_user ON friendships(to_user_id);
CREATE INDEX idx_friendships_status ON friendships(status);
CREATE INDEX idx_memberships_user ON channel_memberships(user_id);
CREATE INDEX idx_memberships_channel ON channel_memberships(channel_id);
CREATE INDEX idx_memberships_active ON channel_memberships(is_active);
```

## Implementation Priority

### Phase 1 (Critical - Fix Current Issues)
1. Enhanced Channel Membership endpoints with proper error handling
2. WebSocket connection improvements and authentication
3. Online user tracking

### Phase 2 (Friend System)
1. Friendship entity and repository
2. Friend management endpoints
3. User search functionality

### Phase 3 (Advanced Features)
1. User status management
2. Enhanced WebSocket messaging
3. Real-time friend notifications

## Testing Endpoints

After implementation, test these endpoints:

```bash
# Test channel joining
POST /channel/join/1
Authorization: Bearer {token}

# Test friend request
POST /users/friend-request
Content-Type: application/json
Authorization: Bearer {token}
{
    "userId": 2
}

# Test online users
GET /users/online?channelId=1
Authorization: Bearer {token}

# Test user search
GET /users/search?q=john
Authorization: Bearer {token}
```

## Configuration Notes

1. **CORS Configuration**: Ensure all new endpoints have proper CORS headers
2. **Authentication**: All endpoints should require valid JWT tokens
3. **Error Handling**: Implement consistent error response format
4. **Logging**: Add comprehensive logging for debugging WebSocket issues
5. **Rate Limiting**: Consider adding rate limiting for friend requests

This implementation should resolve the "reconnecting to chat" and "failed to update membership" issues while adding the complete friend system functionality.
