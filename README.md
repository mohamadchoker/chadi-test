# Real-Time Location Tracking System Backend

A Node.js/Express.js backend application for real-time location tracking with user authentication, location sharing, and WebSocket support.

## Features

- **User Management**: Registration, authentication, and profile management
- **Location Tracking**: Real-time location updates and history
- **Real-time Updates**: WebSocket integration for instant location sharing
- **Security**: JWT authentication, input validation, and data protection
- **Database**: MySQL with Sequelize ORM

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Real-time**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure

```
src/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── AuthController.js    # Authentication endpoints
│   ├── UserController.js    # User management endpoints
│   └── LocationController.js # Location tracking endpoints
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   ├── validation.js       # Input validation middleware
│   └── errorHandler.js     # Global error handling
├── models/
│   ├── index.js            # Model initialization and associations
│   ├── User.js             # User model
│   ├── Location.js         # Current location model
│   └── LocationHistory.js  # Location history model
├── routes/
│   ├── index.js            # Route aggregation
│   ├── authRoutes.js       # Authentication routes
│   ├── userRoutes.js       # User routes
│   └── locationRoutes.js   # Location routes
├── services/
│   ├── AuthService.js      # Authentication business logic
│   ├── UserService.js      # User management business logic
│   └── LocationService.js  # Location tracking business logic
├── sockets/
│   └── locationSocket.js   # WebSocket event handlers
└── server.js               # Application entry point
```

## Installation

1. Clone the repository
2. Install dependencies:
   ``
   npm install
   ``

3. Create environment file:
  ``
   cp .env.example .env
  ``

4. Configure your environment variables in `.env`

5. Create MySQL database:
   ``
   npm run db:create
   npm run db:migrate
   ``

7. Start the development server:
   ``
   npm run dev
  ``

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/location-visibility` - Toggle location visibility
- `GET /api/users/online-users` - Get online users

### Location Tracking
- `POST /api/locations/update` - Update user location
- `GET /api/locations/current/:userId?` - Get current location
- `GET /api/locations/history/:userId?` - Get location history
- `GET /api/locations/visible-users` - Get users with visible locations

## WebSocket Events

### Client to Server
- `toggleLocationSharing` - Toggle location sharing
- `locationUpdate` - Send location update

### Server to Client
- `locationUpdate` - Receive location updates
- `userOnline` - User came online
- `userOffline` - User went offline
- `locationVisibilityChanged` - Location visibility changed

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password` - Hashed password
- `firstName`, `lastName` - User names
- `isLocationVisible` - Location sharing preference
- `isOnline` - Online status
- `lastSeen` - Last activity timestamp

### Locations Table (Current Location)
- `id` - Primary key
- `userId` - Foreign key to users
- `latitude`, `longitude` - GPS coordinates
- `accuracy` - Location accuracy in meters
- `timestamp` - Location timestamp

### Location History Table
- `id` - Primary key
- `userId` - Foreign key to users
- `latitude`, `longitude` - GPS coordinates
- `accuracy` - Location accuracy
- `timestamp` - Location timestamp

## Requirements Compliance Checklist

### ✅ User Management
- **User Registration and Authentication**: Implemented with JWT tokens, password hashing
- **Profile Updates**: Users can update firstName, lastName, username via PUT /api/users/profile
- **Secure Access**: JWT middleware protects all user routes

### ✅ Location Tracking  
- **Real-time Visibility**: `isLocationVisible` boolean controls who can see user locations
- **Location Data API**: POST /api/locations/update accepts latitude/longitude and stores securely
- **Location History**: GET /api/locations/history shows 20-second interval location updates for 24 hours

### ✅ Real-time Updates
- **Instant Location Updates**: Socket.IO WebSocket implementation broadcasts location changes
- **Location Sharing Control**: `toggleLocationSharing` WebSocket event allows users to stop/start sharing

### ✅ Security
- **Authentication and Authorization**: JWT tokens, bcrypt password hashing, input validation
- **Data Security**: Rate limiting, CORS, Helmet security headers, SQL injection prevention

### ✅ Technical Requirements
- **Express.js**: ✅ Used as main framework
- **MySQL**: ✅ Database with proper schema
- **Sequelize**: ✅ ORM for database operations  
- **Clean Architecture**: ✅ Controllers → Services → Models pattern
- **Comments**: ✅ Added throughout codebase

## Database Schema Details

### Primary Tables:
1. **users**: Stores user authentication and profile data
2. **locations**: Current location (one per user, upserted)
3. **location_history**: Historical locations with timestamps

### Key Relationships:
- One user has one current location (1:1)
- One user has many historical locations (1:N)
- Foreign key constraints ensure data integrity

### Indexes for Performance:
- User lookup: email, username
- Location queries: userId, timestamp
- Composite indexes: (userId, timestamp)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with Joi
- Rate limiting
- CORS protection
- Helmet security headers
- SQL injection prevention with Sequelize

## Environment Variables

\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=location_tracking
DB_USER=root
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development


## Development

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

