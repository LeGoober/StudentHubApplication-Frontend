# StudentHub Backend API - Comprehensive Documentation

## Overview
This document provides comprehensive documentation for all API endpoints in the StudentHub Backend application, including authentication, channel management, messaging, user profiles, posts, and products.

## Base URL
```
Local Development: http://localhost:8080
Production: https://your-production-domain.com
```

## Authentication
All endpoints (except login/register) require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 **Authentication & User Management**

### Base Path: `/auth`

#### 1. **Register User**
```http
POST /auth/register
```

**Request Body:**
```json
{
  "userFirstName": "John",
  "userLastName": "Doe",
  "userEmail": "john.doe@example.com",
  "userPassword": "password123",
  "userRole": "STUDENT"
}
```

**Response:** User object with generated ID

**User Roles:**
- `STUDENT`
- `FACULTY_MEMBER`
- `ENTREPRENEUR`
- `ADMIN`

---

#### 2. **Login User**
```http
POST /auth/login
```

**Request Body:**
```json
{
  "userEmail": "john.doe@example.com",
  "userPassword": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "userId": 1,
    "userFirstName": "John",
    "userLastName": "Doe",
    "userEmail": "john.doe@example.com",
    "userRole": "STUDENT"
  }
}
```

---

#### 3. **Get User by ID**
```http
GET /auth/get/{id}
```

**Parameters:**
- `id` (Path): User ID

**Response:** User object

---

#### 4. **Update User**
```http
PUT /auth/update
```

**Request Body:**
```json
{
  "userId": 1,
  "userFirstName": "John",
  "userLastName": "Smith",
  "userEmail": "john.smith@example.com",
  "userRole": "STUDENT"
}
```

**Response:** Updated user object

---

#### 5. **Delete User**
```http
DELETE /auth/delete/{id}
```

**Parameters:**
- `id` (Path): User ID to delete

**Response:** Success message

---

#### 6. **Get All Users**
```http
GET /auth/getAll
```

**Response:** Array of all user objects

---

### Base Path: `/users`

#### 7. **Get Online Users**
```http
GET /users/online?channelId={id}
```

**Query Parameters:**
- `channelId` (Optional): Filter by channel

**Response:** Array of online user objects

---

#### 8. **Update User Status**
```http
PATCH /users/status
```

**Request Body:**
```json
{
  "status": "ONLINE",
  "channelId": 1
}
```

**Status Options:**
- `ONLINE`
- `OFFLINE`
- `BUSY`
- `AWAY`

**Response:** Success message

---

## 💬 **Channel Management**

### Base Path: `/channel`

#### 1. **Create Channel** ✨ *Enhanced with Member Management*
```http
POST /channel/create
```

**Request Body:**
```json
{
  "channelNameField": "Application Development Practice 3",
  "channelTypeField": "ACADEMIC_HELP",
  "description": "A channel for students to collaborate on app development"
}
```

**Channel Types:**
- `ACADEMIC_HELP`
- `STUDY_GROUP`
- `PROJECT_COLLABORATION`
- `GENERAL_DISCUSSION`
- `ENTREPRENEUR_NETWORKING`

**Response:**
```json
{
  "channelId": 1,
  "channelName": "Application Development Practice 3",
  "channelType": "ACADEMIC_HELP",
  "description": "A channel for students to collaborate on app development",
  "adminCreatedChannel": {
    "userId": 123,
    "userFirstName": "John",
    "userLastName": "Doe",
    "userEmail": "john.doe@example.com"
  },
  "channelMembers": [
    {
      "userId": 123,
      "userFirstName": "John",
      "userLastName": "Doe",
      "userEmail": "john.doe@example.com"
    }
  ],
  "createdAt": "2025-08-25T20:00:00",
  "permissions": []
}
```

---

#### 2. **Get Channel by ID**
```http
GET /channel/read/{id}
```

**Parameters:**
- `id` (Path): Channel ID

**Response:** Channel object with members

---

#### 3. **Update Channel**
```http
PUT /channel/update
```

**Request Body:**
```json
{
  "channelId": 1,
  "channelNameField": "Updated Channel Name",
  "channelTypeField": "ACADEMIC_HELP",
  "description": "Updated channel description"
}
```

**Response:** Updated channel object

---

#### 4. **Delete Channel**
```http
DELETE /channel/delete/{id}
```

**Parameters:**
- `id` (Path): Channel ID to delete

**Response:** Success message

---

#### 5. **Get All Channels**
```http
GET /channel/getAll
```

**Response:** Array of all channel objects

---

#### 6. **Join Channel** ✨ *Fixed with Proper Member Management*
```http
POST /channel/join/{channelId}
```

**Parameters:**
- `channelId` (Path): Channel ID to join

**Response:** Success message

**Features:**
- Adds user to channelMembers HashSet
- Persists changes to database
- Sends WebSocket notification to channel members

---

#### 7. **Leave Channel** ✨ *Fixed with Proper Member Management*
```http
DELETE /channel/leave/{channelId}
```

**Parameters:**
- `channelId` (Path): Channel ID to leave

**Response:** Success message

**Features:**
- Removes user from channelMembers HashSet
- Persists changes to database
- Sends WebSocket notification to channel members

---

#### 8. **Get Channel Members** ✨ *Fixed to Return Actual Members*
```http
GET /channel/{channelId}/members
```

**Parameters:**
- `channelId` (Path): Channel ID

**Response:**
```json
[
  {
    "userId": 123,
    "userFirstName": "John",
    "userLastName": "Doe",
    "userEmail": "john.doe@example.com",
    "userRole": "STUDENT"
  },
  {
    "userId": 124,
    "userFirstName": "Jane",
    "userLastName": "Smith",
    "userEmail": "jane.smith@example.com",
    "userRole": "FACULTY_MEMBER"
  }
]
```

---

#### 9. **Get My Channels** ✨ *New Endpoint*
```http
GET /channel/my-channels
```

**Description:** Get all channels where the authenticated user is either admin or member.

**Response:** Array of channel objects where user has access

---

#### 10. **Check Channel Membership** ✨ *New Endpoint*
```http
GET /channel/check-membership/{channelId}
```

**Parameters:**
- `channelId` (Path): Channel ID

**Description:** Check if the authenticated user is a member or admin of the channel.

**Response:**
```json
true
```

---

## 📨 **Message Management**

### Base Path: `/messages`

#### 1. **Get Messages (Paginated)**
```http
GET /messages/{channelId}?page={page}&size={size}
```

**Parameters:**
- `channelId` (Path): Channel ID
- `page` (Query): Page number (default: 0)
- `size` (Query): Page size (default: 20)

**Response:**
```json
{
  "content": [
    {
      "messageId": 1,
      "content": "Hello everyone!",
      "sender": {
        "userId": 123,
        "userFirstName": "John",
        "userLastName": "Doe"
      },
      "timestamp": "2025-08-25T20:00:00",
      "edited": false
    }
  ],
  "pageable": {
    "sort": {
      "sorted": true,
      "direction": "DESC"
    },
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 50,
  "totalPages": 3,
  "first": true,
  "last": false
}
```

---

#### 2. **Send Message**
```http
POST /messages/send
```

**Request Body:**
```json
{
  "channelId": 1,
  "content": "Hello, this is a test message!"
}
```

**Response:** Created message object

**Features:**
- Automatically sets sender from authenticated user
- Sends WebSocket notification to channel members

---

#### 3. **Edit Message**
```http
PUT /messages/{messageId}
```

**Parameters:**
- `messageId` (Path): Message ID to edit

**Request Body:**
```json
{
  "content": "This is the edited message content"
}
```

**Response:** Updated message object

**Features:**
- Only message sender can edit
- Marks message as edited
- Sends WebSocket notification

---

#### 4. **Delete Message**
```http
DELETE /messages/{messageId}
```

**Parameters:**
- `messageId` (Path): Message ID to delete

**Response:** Success message

**Features:**
- Only message sender or channel admin can delete
- Sends WebSocket notification

---

## 👤 **User Profile Management**

### Base Path: `/user_profile`

#### 1. **Create User Profile**
```http
POST /user_profile/create
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "bio": "Computer Science student passionate about technology",
  "contactNumber": "+1234567890",
  "profilePicture": "https://example.com/profile.jpg"
}
```

**Response:** Created profile object

---

#### 2. **Get User Profile**
```http
GET /user_profile/read/{id}
```

**Parameters:**
- `id` (Path): Profile ID

**Response:** Profile object

---

#### 3. **Update User Profile**
```http
PUT /user_profile/update/{id}
```

**Parameters:**
- `id` (Path): Profile ID

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "bio": "Updated bio information",
  "contactNumber": "+1234567890",
  "profilePicture": "https://example.com/updated-profile.jpg"
}
```

**Response:** Updated profile object

---

#### 4. **Delete User Profile**
```http
DELETE /user_profile/delete/{id}
```

**Parameters:**
- `id` (Path): Profile ID to delete

**Response:** Success message

---

#### 5. **Get All User Profiles**
```http
GET /user_profile/getAll
```

**Response:** Array of all profile objects

---

#### 6. **Search Profile by Name**
```http
GET /user_profile/search?firstName={name}&lastName={name}
```

**Query Parameters:**
- `firstName` (Optional): First name to search
- `lastName` (Optional): Last name to search

**Response:** Array of matching profiles

---

#### 7. **Search Profile by Email**
```http
GET /user_profile/search/email?email={email}
```

**Query Parameters:**
- `email`: Email to search

**Response:** Array of matching profiles

---

## 🚀 **Entrepreneur Profile Management**

### Base Path: `/entrepreneur_profile`

#### 1. **Create Entrepreneur Profile**
```http
POST /entrepreneur_profile/create
```

**Request Body:**
```json
{
  "companyName": "Tech Startup Inc",
  "industry": "Technology",
  "businessDescription": "AI-powered solutions for small businesses",
  "website": "https://techstartup.com",
  "linkedInProfile": "https://linkedin.com/in/johndoe",
  "yearsOfExperience": 5
}
```

**Response:** Created entrepreneur profile object

---

#### 2. **Get Entrepreneur Profile**
```http
GET /entrepreneur_profile/read/{id}
```

**Parameters:**
- `id` (Path): Entrepreneur profile ID

**Response:** Entrepreneur profile object

---

#### 3. **Update Entrepreneur Profile**
```http
PUT /entrepreneur_profile/update
```

**Request Body:**
```json
{
  "entrepreneurUserProfileId": 1,
  "companyName": "Updated Tech Startup Inc",
  "industry": "Fintech",
  "businessDescription": "Updated business description",
  "website": "https://updated-techstartup.com",
  "linkedInProfile": "https://linkedin.com/in/johndoe-updated",
  "yearsOfExperience": 6
}
```

**Response:** Updated entrepreneur profile object

---

#### 4. **Delete Entrepreneur Profile**
```http
DELETE /entrepreneur_profile/delete/{id}
```

**Parameters:**
- `id` (Path): Entrepreneur profile ID to delete

**Response:** Success message

---

#### 5. **Get All Entrepreneur Profiles**
```http
GET /entrepreneur_profile/getAll
```

**Response:** Array of all entrepreneur profile objects

---

## 📝 **User Posts Management**

### Base Path: `/user_post`

#### 1. **Create User Post**
```http
POST /user_post/create
```

**Request Body:**
```json
{
  "postContent": "This is my first post on StudentHub!",
  "postType": "GENERAL",
  "postTitle": "Welcome Post"
}
```

**Post Types:**
- `GENERAL`
- `ACADEMIC`
- `PROJECT`
- `JOB_OPPORTUNITY`
- `EVENT`

**Response:** Created post object

---

#### 2. **Get User Post**
```http
GET /user_post/get/{id}
```

**Parameters:**
- `id` (Path): Post ID

**Response:** Post object

---

#### 3. **Update User Post**
```http
PUT /user_post/update
```

**Request Body:**
```json
{
  "userPostId": 1,
  "postContent": "Updated post content",
  "postType": "GENERAL",
  "postTitle": "Updated Post Title"
}
```

**Response:** Updated post object

---

#### 4. **Delete User Post**
```http
DELETE /user_post/delete/{id}
```

**Parameters:**
- `id` (Path): Post ID to delete

**Response:** Success message

---

#### 5. **Get All User Posts**
```http
GET /user_post/getAll
```

**Response:** Array of all post objects

---

#### 6. **Get Posts by User**
```http
GET /user_post/user/{userId}
```

**Parameters:**
- `userId` (Path): User ID

**Response:** Array of posts by specific user

---

#### 7. **Search Posts by Content**
```http
GET /user_post/search?content={content}
```

**Query Parameters:**
- `content`: Content to search for

**Response:** Array of posts containing the search content

---

## 🛍️ **Product Management**

### Base Path: `/products`

#### 1. **Create Product**
```http
POST /products/create
```

**Request Body:**
```json
{
  "productName": "Programming Textbook",
  "productDescription": "Comprehensive guide to Java programming",
  "productPrice": 49.99,
  "productCategory": "BOOKS",
  "productCondition": "NEW"
}
```

**Product Categories:**
- `BOOKS`
- `ELECTRONICS`
- `SUPPLIES`
- `FURNITURE`
- `CLOTHING`
- `OTHER`

**Product Conditions:**
- `NEW`
- `USED_LIKE_NEW`
- `USED_GOOD`
- `USED_FAIR`

**Response:** Created product object

---

#### 2. **Get Product**
```http
GET /products/read/{id}
```

**Parameters:**
- `id` (Path): Product ID

**Response:** Product object

---

#### 3. **Update Product**
```http
PUT /products/update
```

**Request Body:**
```json
{
  "productId": 1,
  "productName": "Updated Programming Textbook",
  "productDescription": "Updated comprehensive guide to Java programming",
  "productPrice": 39.99,
  "productCategory": "BOOKS",
  "productCondition": "USED"
}
```

**Response:** Updated product object

---

#### 4. **Delete Product**
```http
DELETE /products/delete/{id}
```

**Parameters:**
- `id` (Path): Product ID to delete

**Response:** Success message

---

#### 5. **Get All Products**
```http
GET /products/getAll
```

**Response:** Array of all product objects

---

## 🤝 **User-Product Relationships**

### Base Path: `/user_product`

#### 1. **Create User-Product Relationship**
```http
POST /user_product/create
```

**Request Body:**
```json
{
  "userId": 1,
  "productId": 1,
  "relationshipType": "OWNER"
}
```

**Relationship Types:**
- `OWNER`
- `INTERESTED`
- `PURCHASED`
- `SOLD`

**Response:** Created relationship object

---

#### 2. **Get User-Product Relationship**
```http
GET /user_product/get/{id}
```

**Parameters:**
- `id` (Path): Relationship ID

**Response:** Relationship object

---

#### 3. **Update User-Product Relationship**
```http
PUT /user_product/update
```

**Request Body:**
```json
{
  "userProductId": 1,
  "userId": 1,
  "productId": 1,
  "relationshipType": "INTERESTED"
}
```

**Response:** Updated relationship object

---

#### 4. **Delete User-Product Relationship**
```http
DELETE /user_product/delete/{id}
```

**Parameters:**
- `id` (Path): Relationship ID to delete

**Response:** Success message

---

#### 5. **Get All User-Product Relationships**
```http
GET /user_product/getAll
```

**Response:** Array of all relationship objects

---

## 🔌 **WebSocket Integration**

### WebSocket Endpoint
```
ws://localhost:8080/websocket
```

### Message Types
The application supports real-time messaging through WebSocket connections:

#### Channel Events:
- `USER_JOINED_CHANNEL`: When a user joins a channel
- `USER_LEFT_CHANNEL`: When a user leaves a channel
- `NEW_MESSAGE`: When a new message is sent
- `MESSAGE_EDITED`: When a message is edited
- `MESSAGE_DELETED`: When a message is deleted

#### User Status Events:
- `USER_STATUS_CHANGED`: When a user's status changes

### Example WebSocket Message:
```json
{
  "type": "NEW_MESSAGE",
  "channelId": 1,
  "message": {
    "messageId": 123,
    "content": "Hello everyone!",
    "sender": {
      "userId": 456,
      "userFirstName": "John",
      "userLastName": "Doe"
    },
    "timestamp": "2025-08-25T20:00:00"
  }
}
```

---

## 🔒 **Security & Authorization**

### JWT Token Structure
```json
{
  "sub": "user@example.com",
  "userId": 123,
  "userRole": "STUDENT",
  "iat": 1724615200,
  "exp": 1724701600
}
```

### Role-Based Permissions

#### Admin (`ADMIN`):
- Full access to all endpoints
- Can manage any user/channel/content

#### Faculty Member (`FACULTY_MEMBER`):
- Can create and manage academic channels
- Can moderate content
- Access to student profiles

#### Entrepreneur (`ENTREPRENEUR`):
- Can create business-related channels
- Access to entrepreneur networking features
- Can create and manage products

#### Student (`STUDENT`):
- Can join channels
- Can create posts and messages
- Basic profile management

---

## 📊 **Error Handling**

### Standard HTTP Status Codes

- `200 OK`: Successful GET, PUT requests
- `201 Created`: Successful POST requests
- `204 No Content`: Successful DELETE requests
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `500 Internal Server Error`: Server error

### Error Response Format
```json
{
  "error": "Bad Request",
  "message": "Invalid email format",
  "status": 400,
  "timestamp": "2025-08-25T20:00:00",
  "path": "/auth/register"
}
```

---

## 🧪 **Testing Guidelines**

### Postman Collection Usage

1. **Import the Collection:**
   - Use `StudentHub_API_Collection.json`

2. **Setup Environment:**
   - Use `StudentHub_Postman_Environment.json`
   - Update `base_url` for your environment

3. **Authentication Flow:**
   - Register a test user
   - Login to get JWT token
   - Token is automatically saved in environment

4. **Testing Sequence:**
   - Authentication → User Profiles → Channels → Messages → Posts → Products

### Example Test Flow

1. **Register User** → Get user ID
2. **Login** → Get JWT token
3. **Create Channel** → Get channel ID
4. **Join Channel** → Verify membership
5. **Send Message** → Test real-time features
6. **Create Post** → Test content creation
7. **Create Product** → Test marketplace features

---

## 📈 **API Rate Limits**

- **Authentication endpoints**: 10 requests/minute
- **General endpoints**: 100 requests/minute
- **Message endpoints**: 60 requests/minute
- **WebSocket connections**: 5 concurrent per user

---

## 🚀 **Deployment Notes**

### Environment Variables
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/studenthub
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION:86400}

# Server Configuration
server.port=${PORT:8080}
server.servlet.context-path=/

# WebSocket Configuration
websocket.endpoint=/websocket
websocket.allowed-origins=${ALLOWED_ORIGINS:http://localhost:3000}
```

### Production Checklist
- [ ] Update CORS settings for production domain
- [ ] Configure SSL/TLS certificates
- [ ] Set up database connection pooling
- [ ] Configure logging levels
- [ ] Set up health check endpoints
- [ ] Configure backup strategies
- [ ] Set up monitoring and alerts

---

## 📞 **Support & Contact**

For questions or issues regarding the API:
- **Documentation**: Check this file for endpoint details
- **Backend Issues**: Check application logs
- **Database Issues**: Verify connection settings
- **Authentication Issues**: Verify JWT configuration

---

**Last Updated:** August 26, 2025
**API Version:** 3.0.0
**Backend Version:** Spring Boot 2.7+
