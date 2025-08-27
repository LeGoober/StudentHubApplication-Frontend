# Backend Search Requirements for Multi-Instance Support

## Overview
This document outlines the backend API requirements to support cross-instance user and channel search functionality for the CPUT StudentHub application.

## Current Frontend Search Capabilities

The frontend SearchModal currently implements:
- **Channel Search**: Searches through all available channels using `/channel/getAll`
- **User Search**: Searches through all users using `/auth/getAll` 
- **Real-time Filtering**: Client-side filtering by name, description, category, email
- **Cross-type Search**: Single search interface for both users and channels

## Required Backend API Enhancements

### 1. Enhanced Search Endpoint

**Endpoint**: `POST /search/global`

**Request Body**:
```json
{
  "query": "search term",
  "types": ["users", "channels", "messages"], // optional filter
  "limit": 20,
  "offset": 0,
  "includePrivate": false, // whether to include private channels user has access to
  "scope": "all" // "all", "my_channels", "public_channels"
}
```

**Response Format**:
```json
{
  "results": {
    "users": [
      {
        "id": 123,
        "username": "john.doe",
        "displayName": "John Doe", 
        "email": "john.doe@cput.ac.za",
        "avatar": "https://...",
        "status": "online",
        "isOnline": true,
        "userRole": "STUDENT",
        "lastSeen": "2024-01-15T10:30:00Z",
        "faculty": "Engineering"
      }
    ],
    "channels": [
      {
        "id": 456,
        "name": "computer-science-year3",
        "description": "CS Year 3 students discussion",
        "category": "Academic",
        "memberCount": 45,
        "isPrivate": false,
        "isJoined": true,
        "lastActivity": "2024-01-15T09:15:00Z",
        "faculty": "Engineering"
      }
    ],
    "messages": [
      {
        "id": "789",
        "content": "Has anyone completed the database assignment?",
        "channelId": 456,
        "channelName": "computer-science-year3", 
        "authorId": 123,
        "authorName": "John Doe",
        "timestamp": "2024-01-15T08:45:00Z"
      }
    ]
  },
  "totalResults": {
    "users": 5,
    "channels": 3, 
    "messages": 12
  },
  "hasMore": {
    "users": false,
    "channels": false,
    "messages": true
  }
}
```

### 2. User Discovery Endpoints

**Public User Search** (for finding users across instances):
```http
GET /users/search?q={query}&faculty={faculty}&role={role}&limit=20
```

**User Presence/Online Status**:
```http
GET /users/online?channelId={channelId}&faculty={faculty}
```

**User Profile Summary** (lightweight for search results):
```http
GET /users/profile/summary/{userId}
```

### 3. Channel Discovery Enhancements

**Public Channel Search** (enhanced version of existing):
```http
GET /channel/search?q={query}&category={category}&faculty={faculty}&includePrivate=false
```

**Channel Membership Check** (batch version):
```http
POST /channel/membership/batch
Body: { "channelIds": [1,2,3,4,5] }
```

**Trending/Popular Channels**:
```http
GET /channel/trending?faculty={faculty}&timeframe=7d&limit=10
```

## Database Schema Considerations

### Enhanced Indexing
```sql
-- For fast text search
CREATE INDEX idx_users_search ON users USING gin(to_tsvector('english', username || ' ' || display_name || ' ' || email));
CREATE INDEX idx_channels_search ON channels USING gin(to_tsvector('english', name || ' ' || description));
CREATE INDEX idx_messages_search ON messages USING gin(to_tsvector('english', content));

-- For filtering and sorting
CREATE INDEX idx_users_faculty_status ON users(faculty, status, last_seen DESC);
CREATE INDEX idx_channels_category_activity ON channels(category, last_activity DESC, member_count DESC);
CREATE INDEX idx_messages_channel_timestamp ON messages(channel_id, created_at DESC);
```

### User Table Enhancements
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS:
- faculty VARCHAR(100),
- student_number VARCHAR(20),
- staff_number VARCHAR(20), 
- search_visibility VARCHAR(20) DEFAULT 'public', -- 'public', 'faculty_only', 'private'
- last_activity TIMESTAMP DEFAULT NOW()
```

### Channel Table Enhancements  
```sql
ALTER TABLE channels ADD COLUMN IF NOT EXISTS:
- faculty VARCHAR(100),
- last_activity TIMESTAMP DEFAULT NOW(),
- member_count INTEGER DEFAULT 0,
- search_visibility VARCHAR(20) DEFAULT 'public'
```

## Multi-Instance Support Architecture

### 1. Federation Pattern (Recommended)
If running multiple instances, implement a federation service:

```java
@Service
public class SearchFederationService {
    
    @Value("${app.peer-instances}")
    private List<String> peerInstances;
    
    public SearchResults searchAcrossInstances(SearchRequest request) {
        List<CompletableFuture<SearchResults>> futures = peerInstances.stream()
            .map(instance -> searchInstance(instance, request))
            .collect(toList());
            
        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
            .thenApply(v -> futures.stream()
                .map(CompletableFuture::join)
                .reduce(SearchResults::merge)
                .orElse(SearchResults.empty()))
            .join();
    }
}
```

### 2. Shared Database Pattern (Alternative)
All instances connect to the same central database with proper connection pooling and read replicas.

## Security & Privacy Considerations

### Permission Checks
```java
@PreAuthorize("hasPermission(#channelId, 'Channel', 'READ')")
public Channel getChannel(Long channelId) { ... }

@PreAuthorize("@userService.canViewProfile(#targetUserId, authentication.name)")
public User getUserProfile(Long targetUserId) { ... }
```

### Data Filtering
- Only show public channels and joined private channels
- Respect user privacy settings
- Filter by faculty/department if configured
- Rate limiting on search endpoints

## Real-time Updates (Optional)

### WebSocket Events for Search Results
```javascript
// Frontend subscription
websocket.subscribe('/topic/search-updates', (update) => {
  if (update.type === 'new_channel' || update.type === 'user_joined') {
    refreshSearchResults();
  }
});
```

### Backend Event Broadcasting
```java
@EventListener
public void handleChannelCreated(ChannelCreatedEvent event) {
    webSocketService.broadcast("/topic/search-updates", 
        SearchUpdate.builder()
            .type("new_channel")
            .channelId(event.getChannelId())
            .channelName(event.getChannelName())
            .build());
}
```

## Implementation Priority

### Phase 1: Core Search (High Priority)
1. ✅ Enhanced `/search/global` endpoint
2. ✅ Database indexing for performance
3. ✅ Basic security/privacy filtering

### Phase 2: Multi-Instance (Medium Priority)  
1. Federation service implementation
2. Cross-instance communication
3. Result aggregation and deduplication

### Phase 3: Advanced Features (Low Priority)
1. Real-time search updates
2. Search analytics and trending
3. Advanced filtering and sorting

## Frontend Integration

The current frontend search implementation will automatically work with these backend enhancements. The SearchModal already:

- ✅ Handles loading states
- ✅ Processes user and channel results  
- ✅ Supports result selection and navigation
- ✅ Implements proper error handling

### Required Frontend Updates
1. Update API calls to use new search endpoint
2. Handle additional result metadata (faculty, member counts, etc.)
3. Add faculty/category filtering UI components

## Testing Requirements

### API Testing
```java
@Test
void testGlobalSearch() {
    SearchRequest request = SearchRequest.builder()
        .query("computer science")
        .types(List.of("users", "channels"))
        .limit(10)
        .build();
        
    SearchResults results = searchService.globalSearch(request);
    
    assertThat(results.getUsers()).hasSize(5);
    assertThat(results.getChannels()).hasSize(3);
    assertThat(results.getTotalResults().getUsers()).isEqualTo(15);
}
```

### Performance Testing
- Search response time < 500ms for 1000+ users/channels
- Database query optimization with EXPLAIN ANALYZE
- Load testing with concurrent search requests

## Configuration Examples

### application.yml
```yaml
app:
  search:
    max-results-per-type: 20
    enable-message-search: true
    cache-ttl: 300 # 5 minutes
    federation:
      enabled: false
      peer-instances:
        - "https://studenthub-eng.cput.ac.za"
        - "https://studenthub-business.cput.ac.za"
      timeout: 5s
  
  privacy:
    default-user-visibility: "public"
    default-channel-visibility: "public" 
    faculty-isolation: false
```

This comprehensive backend implementation will enable robust multi-instance search functionality while maintaining security and performance standards.
