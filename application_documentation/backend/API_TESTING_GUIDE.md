# StudentHub API Testing Guide

## Overview
This guide provides comprehensive testing instructions for all StudentHub Backend API endpoints using the provided Postman collection.

## Prerequisites

### 1. Import Collections
1. **Import Collection**: `StudentHub_API_Collection.json`
2. **Import Environment**: `StudentHub_Postman_Environment.json`

### 2. Setup Environment
1. Set `base_url` to your backend URL (default: `http://localhost:8080`)
2. Ensure backend server is running
3. Verify database is connected and accessible

---

## 🔧 **Quick Start Testing**

### Step 1: Authentication Flow
```
1. Register User → Save user_id
2. Login → JWT token auto-saved to environment
3. Verify token works with "Get User by ID"
```

### Step 2: Channel & Messaging Flow
```
1. Create Channel → Save channel_id
2. Join Channel → Verify membership
3. Send Message → Test real-time messaging
4. Get Messages → Verify pagination
```

### Step 3: Content Management Flow
```
1. Create User Profile
2. Create User Post
3. Create Product
4. Create User-Product Relationship
```

---

## 📋 **Detailed Testing Scenarios**

### 🔐 Authentication & User Management

#### Test Scenario 1: User Registration & Login
**Steps:**
1. **Register New User**
   - Endpoint: `POST /auth/register`
   - Verify: User created with unique ID
   - Check: Password is hashed (not stored as plain text)

2. **Login with Credentials**
   - Endpoint: `POST /auth/login`
   - Verify: JWT token returned
   - Check: Token auto-saved in environment variables

3. **Access Protected Endpoint**
   - Endpoint: `GET /auth/get/{user_id}`
   - Verify: User data returned with valid token

**Expected Results:**
- ✅ Registration creates user with hashed password
- ✅ Login returns valid JWT token
- ✅ Protected endpoints work with token
- ❌ Protected endpoints fail without token

#### Test Scenario 2: User Management Operations
**Steps:**
1. **Update User Information**
   - Endpoint: `PUT /auth/update`
   - Change: firstName, lastName, email
   - Verify: Changes persisted in database

2. **Get All Users**
   - Endpoint: `GET /auth/getAll`
   - Verify: Returns array of all users
   - Check: No password fields in response

3. **User Status Management**
   - Endpoint: `PATCH /users/status`
   - Test: ONLINE, OFFLINE, BUSY, AWAY statuses
   - Verify: Status updates correctly

---

### 💬 Channel Management Testing

#### Test Scenario 3: Channel Lifecycle ✨ **Enhanced Testing**
**Steps:**
1. **Create Channel**
   - Endpoint: `POST /channel/create`
   - Verify: Creator automatically added as admin
   - Check: channelMembers HashSet initialized with admin

2. **Join Channel**
   - Endpoint: `POST /channel/join/{channelId}`
   - Use different user account
   - Verify: User added to channelMembers HashSet
   - Check: Database persistence

3. **Get Channel Members**
   - Endpoint: `GET /channel/{channelId}/members`
   - Verify: Returns actual members (not all users)
   - Check: Both admin and joined user present

4. **Leave Channel**
   - Endpoint: `DELETE /channel/leave/{channelId}`
   - Verify: User removed from channelMembers HashSet
   - Check: Database updated correctly

5. **Get My Channels**
   - Endpoint: `GET /channel/my-channels`
   - Verify: Returns channels where user is admin OR member
   - Test with multiple users

6. **Check Membership**
   - Endpoint: `GET /channel/check-membership/{channelId}`
   - Test: Returns `true` for members, `false` for non-members

**Critical Validations:**
- ✅ Channel creation initializes members properly
- ✅ Join/leave operations update HashSet correctly
- ✅ Members endpoint returns actual members
- ✅ My channels returns user's accessible channels
- ✅ Membership check works accurately

#### Test Scenario 4: Channel Permissions & Access
**Steps:**
1. **Test Non-Member Access**
   - Try to get messages from channel user hasn't joined
   - Verify: Proper access control

2. **Test Admin Privileges**
   - Update channel as admin
   - Delete messages as admin
   - Verify: Admin permissions work

3. **Test Member Limitations**
   - Try to delete channel as non-admin member
   - Verify: Proper permission restrictions

---

### 📨 Message Management Testing

#### Test Scenario 5: Real-time Messaging
**Steps:**
1. **Send Message to Channel**
   - Endpoint: `POST /messages/send`
   - Verify: Message stored with correct sender
   - Check: Timestamp generated automatically

2. **Get Paginated Messages**
   - Endpoint: `GET /messages/{channelId}?page=0&size=10`
   - Verify: Correct pagination structure
   - Check: Messages ordered by timestamp (newest first)

3. **Edit Message**
   - Endpoint: `PUT /messages/{messageId}`
   - Verify: Only sender can edit
   - Check: Message marked as edited

4. **Delete Message**
   - Endpoint: `DELETE /messages/{messageId}`
   - Verify: Sender and admin can delete
   - Check: Message removed from database

**Message Testing Matrix:**
| Test Case | Sender | Action | Expected Result |
|-----------|--------|--------|-----------------|
| Send Message | Member | POST | ✅ Success |
| Send Message | Non-Member | POST | ❌ Forbidden |
| Edit Own Message | Original Sender | PUT | ✅ Success |
| Edit Other's Message | Different User | PUT | ❌ Forbidden |
| Delete Own Message | Original Sender | DELETE | ✅ Success |
| Delete as Admin | Channel Admin | DELETE | ✅ Success |
| Delete as Member | Non-Admin Member | DELETE | ❌ Forbidden |

---

### 👤 Profile Management Testing

#### Test Scenario 6: User Profile Operations
**Steps:**
1. **Create User Profile**
   - Endpoint: `POST /user_profile/create`
   - Include: firstName, lastName, email, bio, contactNumber
   - Verify: Profile linked to authenticated user

2. **Search Profiles**
   - Test: `GET /user_profile/search?firstName=John&lastName=Doe`
   - Test: `GET /user_profile/search/email?email=john@example.com`
   - Verify: Search functionality works correctly

3. **Update Profile**
   - Endpoint: `PUT /user_profile/update/{id}`
   - Change multiple fields
   - Verify: Updates persist correctly

#### Test Scenario 7: Entrepreneur Profile Management
**Steps:**
1. **Create Entrepreneur Profile**
   - Endpoint: `POST /entrepreneur_profile/create`
   - Include: companyName, industry, businessDescription
   - Verify: Links to user profile correctly

2. **Update Business Information**
   - Endpoint: `PUT /entrepreneur_profile/update`
   - Update: website, linkedInProfile, yearsOfExperience
   - Verify: Changes saved correctly

---

### 📝 Posts & Products Testing

#### Test Scenario 8: Content Creation & Management
**Steps:**
1. **Create User Post**
   - Endpoint: `POST /user_post/create`
   - Test different postTypes: GENERAL, ACADEMIC, PROJECT
   - Verify: Post linked to authenticated user

2. **Search Posts**
   - Endpoint: `GET /user_post/search?content=programming`
   - Verify: Content-based search works
   - Test: Partial matches, case sensitivity

3. **Get Posts by User**
   - Endpoint: `GET /user_post/user/{userId}`
   - Verify: Returns only posts by specific user

4. **Product Management**
   - Create: `POST /products/create`
   - Test: Different categories (BOOKS, ELECTRONICS, SUPPLIES)
   - Test: Different conditions (NEW, USED_LIKE_NEW, USED_GOOD)

5. **User-Product Relationships**
   - Create: `POST /user_product/create`
   - Test: Different relationship types (OWNER, INTERESTED, PURCHASED)
   - Verify: Relationships tracked correctly

---

## 🧪 **Advanced Testing Scenarios**

### Scenario 9: Multi-User Channel Testing
**Setup:** Create 3 test users
**Steps:**
1. User A creates channel
2. User B joins channel
3. User C joins channel
4. All users send messages
5. User B leaves channel
6. Verify User B can't access messages
7. User A (admin) deletes channel
8. Verify all members lose access

### Scenario 10: Pagination Testing
**Steps:**
1. Create 50+ messages in channel
2. Test: `GET /messages/{channelId}?page=0&size=20`
3. Test: `GET /messages/{channelId}?page=1&size=20`
4. Verify: Correct pagination metadata
5. Check: No duplicate messages across pages

### Scenario 11: Search Functionality Testing
**Content Search Test:**
1. Create posts with keywords: "Java", "Python", "JavaScript"
2. Search: `?content=Java`
3. Verify: Returns posts containing "Java" and "JavaScript"
4. Test: Case sensitivity, partial matches

**Profile Search Test:**
1. Create profiles with various names
2. Test: Single field search
3. Test: Multi-field search
4. Verify: Accurate search results

---

## 🚨 **Error Testing**

### Authentication Errors
- **Invalid Credentials**: Wrong email/password
- **Missing Token**: Access protected endpoint without token
- **Expired Token**: Use expired JWT token
- **Invalid Token**: Use malformed JWT token

### Resource Errors  
- **Not Found**: Access non-existent channel/message/user
- **Forbidden**: Access resource without permission
- **Duplicate**: Create user with existing email

### Validation Errors
- **Missing Fields**: Send incomplete request bodies
- **Invalid Data**: Send invalid email formats, negative IDs
- **Constraint Violations**: Violate database constraints

---

## 📊 **Performance Testing**

### Load Testing Recommendations
1. **Concurrent Users**: Test 10+ simultaneous logins
2. **Message Volume**: Send 100+ messages rapidly
3. **Channel Members**: Add 50+ users to single channel
4. **Database Load**: Create 1000+ records and test query performance

### Response Time Benchmarks
- **Authentication**: < 200ms
- **Channel Operations**: < 300ms
- **Message Retrieval**: < 500ms (paginated)
- **Search Operations**: < 1000ms

---

## ✅ **Testing Checklist**

### Core Functionality
- [ ] User registration/login works
- [ ] JWT authentication enforced
- [ ] Channel creation with proper member management
- [ ] Channel join/leave updates HashSet correctly
- [ ] Real-time messaging functions
- [ ] Message editing/deletion works
- [ ] Profile creation/updates persist
- [ ] Search functionality accurate
- [ ] Product management complete
- [ ] User-product relationships tracked

### Security & Permissions
- [ ] Unauthorized access blocked
- [ ] Role-based permissions enforced
- [ ] Data validation prevents injection
- [ ] Password security (hashing, no plain text)
- [ ] JWT token expiration handled

### Data Integrity
- [ ] Database constraints enforced
- [ ] Relationships maintain consistency
- [ ] HashSet operations persist correctly
- [ ] Pagination works without data loss
- [ ] Search results accurate

### Error Handling
- [ ] Appropriate HTTP status codes
- [ ] Meaningful error messages
- [ ] Graceful handling of edge cases
- [ ] No sensitive data in error responses

---

## 🔧 **Common Issues & Solutions**

### Issue: "Unauthorized" on all requests
**Solution:** 
1. Ensure you've logged in first
2. Check JWT token is saved in environment
3. Verify token format: `Bearer <token>`

### Issue: Channel join/leave not working
**Solution:**
1. Verify you're not already a member (for join)
2. Check channel exists and you have access
3. Confirm channelMembers HashSet updates

### Issue: Messages not appearing
**Solution:**
1. Verify you're a channel member
2. Check pagination parameters
3. Confirm messages aren't filtered by permissions

### Issue: Search returns no results
**Solution:**
1. Verify search terms exist in data
2. Check case sensitivity
3. Ensure proper query parameter format

---

## 📈 **Monitoring & Logging**

### What to Monitor During Testing
- **Response Times**: Track endpoint performance
- **Error Rates**: Monitor 4xx and 5xx responses  
- **Database Connections**: Watch for connection leaks
- **Memory Usage**: Monitor for memory leaks
- **WebSocket Connections**: Track real-time connection health

### Logging Best Practices
- Enable debug logging during testing
- Log authentication attempts
- Track channel membership changes
- Monitor message creation/deletion
- Log search query performance

---

**Last Updated:** August 26, 2025
**Testing Framework:** Postman Collection v3.0.0
**Backend Version:** Spring Boot with Enhanced Channel Management
