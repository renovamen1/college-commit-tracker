# 🔐 Authentication System Testing Guide

## 🎯 **Testing Your Newly Implemented Authentication System**

This guide will help you validate that the JWT Refresh Token System and Authentication Middleware are working correctly in your development environment.

---

## 📋 **Pre-Testing Setup**

### **1. Environment Configuration**
Ensure your `.env.local` file has the required JWT settings:
```bash
# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-min-10-chars
JWT_ACCESS_TOKEN_EXPIRES=15m
JWT_REFRESH_TOKEN_EXPIRES=7d

# API Configuration
MONGODB_URI=mongodb://localhost:27017/your-db
NODE_ENV=development
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Start Development Server**
```bash
npm run dev
```

---

## 🧪 **Authentication System Testing Steps**

### **TEST 1: Login Flow Verification**
```bash
# 1. Test login with valid credentials
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin@codecommit.edu",
    "password": "admin123",
    "rememberMe": true
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "username": "admin@codecommit.edu",
      "role": "admin"
    }
  }
}
```

**Expected Cookies Set:**
- `admin_token` (HTTP-only, 15min expiry)
- `admin_refresh_token` (HTTP-only, 7d expiry)
- `admin_user` (client-accessible user data)

---

### **TEST 2: Protected Route Access**
```bash
# 2. Test protected admin route with valid token
curl -X GET "http://localhost:3000/api/admin/classes" \
  -H "Cookie: admin_token=YOUR_TOKEN_HERE"

# OR using Authorization header:
curl -X GET "http://localhost:3000/api/admin/classes" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Classes retrieved successfully",
  "data": {
    "classes": [...],
    "pagination": {...}
  }
}
```

---

### **TEST 3: Unauthorized Access Blocking**
```bash
# 3. Test protected route without authentication
curl -X GET "http://localhost:3000/api/admin/classes"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Authentication required",
  "data": null,
  "timestamp": "2024-09-14T10:45:30.000Z",
  "version": "1.0.0"
}
```

**Status Code: 401**

---

### **TEST 4: Insufficient Permissions**
```bash
# 4. Create a test student account and try admin route
# (You'll need to create student user in database or via API)

# Student trying to access admin route
curl -X GET "http://localhost:3000/api/admin/classes" \
  -H "Authorization: Bearer STUDENT_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Admin access required",
  "data": null,
  "timestamp": "2024-09-14T10:45:30.000Z",
  "version": "1.0.0"
}
```

**Status Code: 403**

---

### **TEST 5: Token Refresh Functionality**
```bash
# 5. Test automatic token refresh
curl -X POST "http://localhost:3000/api/auth/refresh" \
  -H "Cookie: admin_refresh_token=YOUR_REFRESH_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "user": {
      "id": "user_id",
      "githubUsername": "admin@codecommit.edu",
      "role": "admin"
    }
  }
}
```

---

### **TEST 6: Public Route Accessibility**
```bash
# 6. Test public routes (login should still work without auth)
curl -X POST "http://localhost:3000/api/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin@codecommit.edu",
    "password": "admin123"
  }'
```

**Success:** Login API is accessible without authentication ✅

---

## 🐛 **Common Issues & Debugging**

### **Issue 1: "Module not found" or "Cannot find module"**
```bash
# Solution: Install missing @types packages
npm install --save-dev @types/uuid
```

### **Issue 2: "Invalid JWT signature"**
```bash
# Solution: Check JWT_SECRET is properly set in .env.local
echo $JWT_SECRET
```

### **Issue 3: "Authentication required" even with valid token**
```bash
# Check:
# 1. Token format in Authorization header
# 2. Token hasn't expired (15min limit)
# 3. Cookie isn't being stripped by browser
```

### **Issue 4: "MongoDB connection error"**
```bash
# Check MongoDB is running
mongod --version
ps aux | grep mongod
```

---

## 📊 **Performance Testing**

### **Load Testing Authentication Middleware:**
```bash
# Simulate 10 concurrent users for 30 seconds
ab -n 100 -c 10 -T 'application/json' -H 'Cookie: admin_token=YOUR_TOKEN' \
  http://localhost:3000/api/admin/classes
```

### **Token Refresh Testing:**
```bash
# Test rapid concurrent refresh requests
parallel 'curl -X POST http://localhost:3000/api/auth/refresh -H "Cookie: admin_refresh_token=YOUR_TOKEN" -w "%{http_code}\n"' ::: {1..50}
```

---

## 🔍 **Security Validation**

### **Test Security Headers:**
```bash
curl -I http://localhost:3000/api/admin/classes
# Should see:
# Set-Cookie: admin_token=...; HttpOnly; Secure; SameSite=Strict
# Content-Security-Policy: ...
# X-Frame-Options: DENY
```

### **Rate Limiting Verification:**
```bash
# Make rapid requests to same endpoint
for i in {1..15}; do
  curl -X GET http://localhost:3000/api/admin/classes -s -w "%{http_code}\n"
  sleep 0.1
done
# Should get 429 status after limit exceeded
```

---

## 🎯 **Expected Test Results Summary**

### **✅ All Tests Pass - System Working Perfectly:**
- ✅ Login creates valid JWT tokens
- ✅ Protected routes require authentication
- ✅ Admin routes enforce role permissions
- ✅ Token refresh works seamlessly
- ✅ Security headers are applied
- ✅ Rate limiting functions correctly
- ✅ Public routes remain accessible

### **🎊 Ready for Production:**
When all tests pass, your authentication system is **production-ready** and includes:
- Enterprise-grade security
- Seamless user experience
- Comprehensive error handling
- Performance optimization
- Audit trail capabilities

---

## 🚀 **Next Steps After Testing:**

### **🛡️ Successful Testing Results:**
1. ✅ **Apply authentication middleware to remaining admin routes**
2. ✅ **Test complete API protection system**
3. ✅ **Implement any remaining security enhancements**
4. ✅ **Prepare for production deployment**

### **📊 If Issues Found:**
1. 🔍 **Check error logs** for detailed debugging information
2. 🛠 **Review configuration** settings and environment variables
3. 🔐 **Verify JWT secret** and token generation/validation
4. 📞 **Test database connectivity** and permissions

---

## 🎉 **Certification Checklist:**

**Mark these as you complete testing:**
- [ ] Login endpoint working with token creation
- [ ] Protected routes require authentication
- [ ] Role-based access control enforced
- [ ] Token refresh system functional
- [ ] Security headers automatically applied
- [ ] Rate limiting working correctly
- [ ] Error handling provides clear feedback
- [ ] Performance meets requirements

**🎊 When all are checked, your authentication system is PRODUCTION READY!**
