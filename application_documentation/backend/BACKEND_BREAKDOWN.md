# StudentHub Backend Overview

## Tech Stack
- **Framework**: Spring Boot 3.3.4 (Java 17)
- **Database**: MySQL 
- **Security**: JWT Authentication
- **Real-time**: WebSocket support for messaging
- **Build**: Maven

## Database Configuration
```properties
# MySQL Connection
spring.datasource.url=jdbc:mysql://localhost:3306/StudentHubDatabase
spring.datasource.username=root
spring.datasource.password=admin

# JPA Settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# WebSocket Configuration
websocket.endpoint=/websocket
```

## REST API Endpoints (Complete List)

### Authentication & User Management (`/auth`, `/users`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/get/{id}` - Get user by ID
- `PUT /auth/update` - Update user
- `DELETE /auth/delete/{id}` - Delete user
- `GET /auth/getAll` - List all users
- `GET /users/online?channelId={id}` - Get online users
- `PATCH /users/status` - Update user status

### Channel Management (`/channel`) ✨ **ENHANCED**
- `POST /channel/create` - Create channel (auto-adds admin as member)
- `GET /channel/read/{id}` - Get channel by ID
- `PUT /channel/update` - Update channel
- `DELETE /channel/delete/{id}` - Delete channel
- `GET /channel/getAll` - List all channels
- `POST /channel/join/{channelId}` - Join channel (proper HashSet management)
- `DELETE /channel/leave/{channelId}` - Leave channel (proper HashSet management)
- `GET /channel/{channelId}/members` - Get actual channel members
- `GET /channel/my-channels` - Get user's channels (admin or member)
- `GET /channel/check-membership/{channelId}` - Check if user is channel member

### Message Management (`/messages`) ✨ **NEW**
- `GET /messages/{channelId}?page={page}&size={size}` - Get paginated messages
- `POST /messages/send` - Send message to channel
- `PUT /messages/{messageId}` - Edit message
- `DELETE /messages/{messageId}` - Delete message

### User Profiles (`/user_profile`)
- `POST /user_profile/create` - Create user profile
- `GET /user_profile/read/{id}` - Get user profile
- `PUT /user_profile/update/{id}` - Update user profile
- `DELETE /user_profile/delete/{id}` - Delete user profile
- `GET /user_profile/getAll` - List all profiles
- `GET /user_profile/search?firstName={name}&lastName={name}` - Search by name
- `GET /user_profile/search/email?email={email}` - Search by email

### Entrepreneur Profiles (`/entrepreneur_profile`)
- `POST /entrepreneur_profile/create` - Create entrepreneur profile
- `GET /entrepreneur_profile/read/{id}` - Get entrepreneur profile
- `PUT /entrepreneur_profile/update` - Update entrepreneur profile
- `DELETE /entrepreneur_profile/delete/{id}` - Delete entrepreneur profile
- `GET /entrepreneur_profile/getAll` - List all entrepreneur profiles

### User Posts (`/user_post`)
- `POST /user_post/create` - Create user post
- `GET /user_post/get/{id}` - Get user post
- `PUT /user_post/update` - Update user post
- `DELETE /user_post/delete/{id}` - Delete user post
- `GET /user_post/getAll` - List all posts
- `GET /user_post/user/{userId}` - Get posts by user
- `GET /user_post/search?content={content}` - Search posts by content

### Products (`/products`)
- `POST /products/create` - Create product
- `GET /products/read/{id}` - Get product
- `PUT /products/update` - Update product
- `DELETE /products/delete/{id}` - Delete product
- `GET /products/getAll` - List all products

### User-Product Relationships (`/user_product`)
- `POST /user_product/create` - Create user-product relationship
- `GET /user_product/get/{id}` - Get user-product relationship
- `PUT /user_product/update` - Update user-product relationship
- `DELETE /user_product/delete/{id}` - Delete user-product relationship
- `GET /user_product/getAll` - List all user-product relationships

## Database Entities

### User
- **Table**: `users`
- **Key**: `userId`
- **Fields**: firstName, lastName, email, password, role, studentNumber, staffNumber
- **Relationship**: One-to-One with EntrepreneurUserProfile

### Products
- **Table**: `products`
- **Key**: `productId`
- **Fields**: productName, productDescription, productReturnType
- **Relationship**: Many-to-One with UserProduct

### Channel ✨ **ENHANCED**
- **Table**: `channel`
- **Key**: `channelId`
- **Fields**: channelName, channelType, permissions, description, createdAt
- **Relationships**: 
  - Many-to-One with User (admin)
  - Many-to-Many with User (channelMembers) - **PROPER HASHSET MANAGEMENT**
  - One-to-Many with Message

### Message ✨ **NEW**
- **Table**: `messages`
- **Key**: `messageId`
- **Fields**: content, timestamp, edited, editTimestamp
- **Relationships**: 
  - Many-to-One with User (sender)
  - Many-to-One with Channel

### UserProfile
- **Table**: `user_profiles`
- **Key**: `userProfileId`
- **Fields**: firstName, lastName, email, bio, contactNumber, profilePicture
- **Relationships**: One-to-One with User

### EntrepreneurUserProfile
- **Table**: `entrepreneur_profiles`
- **Key**: `entrepreneurUserProfileId`
- **Fields**: companyName, industry, businessDescription, website, linkedInProfile, yearsOfExperience
- **Relationships**: One-to-One with UserProfile

### UserPost
- **Table**: `user_posts`
- **Key**: `userPostId`
- **Fields**: postContent, postType, postTitle, postTimestamp
- **Relationships**: Many-to-One with User

### UserProduct
- **Table**: `user_products`
- **Key**: `userProductId`
- **Fields**: relationshipType (OWNER, INTERESTED, PURCHASED, SOLD)
- **Relationships**: Many-to-One with User and Product

## User Roles
- `ADMIN` - System administrator with full access
- `STUDENT` - Regular student with basic permissions
- `FACULTY_MEMBER` - Teaching staff with enhanced permissions
- `ENTREPRENEUR` - Business-focused user with networking features

## Security
- JWT tokens for authentication
- BCrypt password encoding
- CORS enabled for `localhost:3000`
- Public endpoints: `/auth/**`
- All other endpoints require authentication

## Service Layer
- Generic `IService<T, id>` interface with CRUD operations
- Organized by domain:
  - `user_services/` - User management
  - `channel_services/` - Channels and products
  - `post_services/` - Post management

## Development
- **Server Port**: 8080
- **Database**: MySQL on localhost:3306
- **Frontend**: CORS configured for localhost:3000
- **Run**: `mvn spring-boot:run`