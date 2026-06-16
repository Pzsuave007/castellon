# Auth Testing
- Login: POST /api/auth/login with {email, password}
- /me: GET /api/auth/me with cookies
- Verify bcrypt hash $2b$, unique email index
