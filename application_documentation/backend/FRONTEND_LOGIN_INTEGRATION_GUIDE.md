# Frontend Login Integration Guide

## Problem Analysis
The WebSocket connection is failing with 403 Forbidden errors because the JWT token is either:
- Missing from the WebSocket connection
- Invalid/expired
- Not properly formatted
- Not being passed correctly to the WebSocket handshake

## Backend Authentication Endpoints

Based on the Spring Boot backend, here are the authentication endpoints:

```
POST /api/auth/login
POST /api/auth/register
```

## Frontend Implementation Requirements

### 1. Login Flow Implementation

Implement the following login flow in your frontend:

```javascript
// Login function
async function login(email, password) {
    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            
            // Store the JWT token securely
            localStorage.setItem('jwt_token', data.token);
            localStorage.setItem('user_email', email);
            
            console.log('Login successful:', data);
            return { success: true, token: data.token, user: data.user };
        } else {
            const errorData = await response.json();
            console.error('Login failed:', errorData);
            return { success: false, error: errorData.message || 'Login failed' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Network error during login' };
    }
}
```

### 2. Token Management

Implement proper token management:

```javascript
// Get stored token
function getAuthToken() {
    return localStorage.getItem('jwt_token');
}

// Check if user is authenticated
function isAuthenticated() {
    const token = getAuthToken();
    return token !== null && token !== undefined && token !== '';
}

// Clear authentication data
function logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
    
    // Disconnect WebSocket if connected
    if (window.stompClient && window.stompClient.connected) {
        window.stompClient.disconnect();
    }
    
    // Redirect to login page
    window.location.href = '/login';
}

// Check token expiration (optional - decode JWT to check exp claim)
function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    } catch (error) {
        return true; // Consider invalid tokens as expired
    }
}
```

### 3. WebSocket Connection with Authentication

Fix your WebSocket connection to properly include the JWT token:

```javascript
// WebSocket connection function
function connectWebSocket() {
    const token = getAuthToken();
    
    if (!token) {
        console.error('No authentication token found. Please login first.');
        window.location.href = '/login';
        return;
    }

    if (isTokenExpired(token)) {
        console.error('Token has expired. Please login again.');
        logout();
        return;
    }

    // Create WebSocket connection with token in URL
    const socket = new SockJS(`http://localhost:8080/ws?token=${encodeURIComponent(token)}`);
    const stompClient = Stomp.over(socket);

    // Enable debug logging
    stompClient.debug = function(str) {
        console.log('STOMP Debug:', str);
    };

    stompClient.connect({}, 
        function(frame) {
            console.log('WebSocket Connected:', frame);
            
            // Subscribe to channels after successful connection
            subscribeToChannels(stompClient);
        },
        function(error) {
            console.error('WebSocket Connection Error:', error);
            
            // Handle authentication errors
            if (error.includes('403') || error.includes('Forbidden')) {
                console.error('WebSocket authentication failed. Token may be invalid.');
                logout();
            }
        }
    );

    // Store reference globally for later use
    window.stompClient = stompClient;
}

function subscribeToChannels(stompClient) {
    // Example subscriptions
    stompClient.subscribe('/topic/messages', function(message) {
        console.log('Received message:', JSON.parse(message.body));
        // Handle incoming messages
    });
    
    stompClient.subscribe('/topic/notifications', function(notification) {
        console.log('Received notification:', JSON.parse(notification.body));
        // Handle notifications
    });
}
```

### 4. HTTP Request Authentication

For regular API calls, include the JWT token in headers:

```javascript
// Authenticated fetch function
async function authenticatedFetch(url, options = {}) {
    const token = getAuthToken();
    
    if (!token) {
        console.error('No authentication token found');
        logout();
        return;
    }

    const authOptions = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, authOptions);
        
        if (response.status === 401 || response.status === 403) {
            console.error('Authentication failed. Redirecting to login.');
            logout();
            return;
        }
        
        return response;
    } catch (error) {
        console.error('Authenticated request failed:', error);
        throw error;
    }
}

// Example usage
async function getUserProfile() {
    const response = await authenticatedFetch('http://localhost:8080/api/user/profile');
    if (response && response.ok) {
        return await response.json();
    }
}
```

### 5. Application Initialization

Initialize your app with proper authentication checks:

```javascript
// App initialization
document.addEventListener('DOMContentLoaded', function() {
    if (isAuthenticated()) {
        const token = getAuthToken();
        
        // Check if token is expired
        if (isTokenExpired(token)) {
            console.log('Token expired, redirecting to login');
            logout();
            return;
        }
        
        // Initialize authenticated features
        initAuthenticatedApp();
        connectWebSocket();
    } else {
        // Redirect to login page
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
        }
    }
});

function initAuthenticatedApp() {
    console.log('Initializing authenticated application features');
    // Initialize your app's authenticated features here
    loadUserData();
    setupUIForAuthenticatedUser();
}
```

### 6. Error Handling and User Feedback

Implement proper error handling:

```javascript
// Error handler for authentication issues
function handleAuthError(error) {
    console.error('Authentication error:', error);
    
    // Show user-friendly error message
    showErrorMessage('Your session has expired. Please login again.');
    
    // Clear stored data and redirect
    setTimeout(() => {
        logout();
    }, 2000);
}

function showErrorMessage(message) {
    // Implement based on your UI framework
    // Example with simple alert (replace with your notification system)
    alert(message);
}

function showSuccessMessage(message) {
    // Implement based on your UI framework
    console.log('Success:', message);
}
```

### 7. Login Form Integration

Update your login form to use the new login function:

```javascript
// Login form submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showErrorMessage('Please enter both email and password');
        return;
    }
    
    // Show loading state
    const submitButton = document.getElementById('loginSubmit');
    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';
    
    try {
        const result = await login(email, password);
        
        if (result.success) {
            showSuccessMessage('Login successful!');
            // Redirect to main app
            window.location.href = '/dashboard'; // or your main page
        } else {
            showErrorMessage(result.error);
        }
    } catch (error) {
        showErrorMessage('An error occurred during login');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    }
});
```

## Testing Checklist

After implementing the above changes, test the following:

1. **Login Flow**
   - [ ] User can login with valid credentials
   - [ ] Invalid credentials show appropriate error message
   - [ ] JWT token is stored in localStorage after successful login

2. **WebSocket Connection**
   - [ ] WebSocket connects successfully after login
   - [ ] No more 403 Forbidden errors in console
   - [ ] WebSocket receives messages properly

3. **Token Management**
   - [ ] Token is included in WebSocket connection URL
   - [ ] Token is included in HTTP request headers
   - [ ] User is redirected to login when token is missing/expired

4. **Error Handling**
   - [ ] Proper error messages for failed login
   - [ ] Automatic logout on token expiration
   - [ ] WebSocket reconnection on authentication failure

## Debug Steps

1. Open browser developer tools and check:
   - Network tab for login request/response
   - Console for any JavaScript errors
   - Application/Storage tab to verify JWT token is stored

2. Check backend logs for:
   - Login attempts and results
   - WebSocket handshake attempts
   - JWT validation messages

3. Verify token format:
   - Token should be a valid JWT (three parts separated by dots)
   - Token should not be empty or null

## Common Issues and Solutions

1. **CORS Issues**: Ensure backend allows requests from your frontend origin
2. **Token Storage**: Use localStorage or sessionStorage, not cookies for JWT
3. **Token Format**: Include `Bearer ` prefix for HTTP headers, but not for WebSocket URL parameter
4. **URL Encoding**: Properly encode the token when adding to WebSocket URL
5. **Token Expiration**: Implement token refresh or force re-login on expiration

## Next Steps

1. Implement the login flow as described above
2. Test the authentication with both HTTP requests and WebSocket connections
3. Monitor the browser console and backend logs for any remaining issues
4. Implement additional features like token refresh if needed
