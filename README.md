# 🏨 Kokya HRBS - Hotel Room Booking System

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> A comprehensive, full-stack hotel room booking system that allows users to search hotels by location, view available rooms, and make secure bookings with integrated payment processing.

## 🌟 Features

### 🔍 **Core Booking Workflow**
- **Hotel Search**: Search hotels by location with real-time results
- **Room Discovery**: Browse available rooms with detailed amenities
- **Seamless Booking**: Complete reservation workflow with date selection
- **Instant Confirmation**: Real-time booking confirmation and updates

### 👤 **User Management**
- **User Registration & Login**: Secure authentication system
- **Email Verification**: Automated email verification for new accounts
- **Profile Management**: User dashboard and account management
- **Role-Based Access**: Support for different user roles (user/admin)

### 💳 **Payment & Security**
- **Secure Payment Processing**: Integrated payment handling
- **Transaction Management**: Complete payment tracking and history
- **Data Security**: JWT authentication with bcrypt password hashing
- **Input Validation**: Comprehensive data validation and sanitization

### 🎫 **Customer Support**
- **Support Ticket System**: Built-in customer support functionality
- **Issue Tracking**: Complete ticket lifecycle management
- **Email Notifications**: Automated email communications

### 📊 **Administrative Features**
- **Hotel Management**: CRUD operations for hotel listings
- **Room Management**: Room inventory and availability tracking
- **Booking Analytics**: Comprehensive booking and payment reports
- **User Administration**: User account management and verification

## 🏗️ System Architecture

```mermaid
graph TB
    A[Frontend - React + TypeScript] --> B[Backend API - Express + TypeScript]
    B --> C[Database - PostgreSQL]
    B --> D[Email Service - Nodemailer]
    B --> E[Authentication - JWT + Bcrypt]
    
    subgraph "Frontend Stack"
    F[React 19 + TypeScript]
    G[Tailwind CSS + DaisyUI]
    H[React Router DOM]
    I[Vite Build Tool]
    end
    
    subgraph "Backend Stack"
    J[Express.js + TypeScript]
    K[Drizzle ORM]
    L[JWT Authentication]
    M[Email Verification]
    N[Payment Processing]
    end
    
    A --> F
    A --> G
    A --> H
    A --> I
    
    B --> J
    B --> K
    B --> L
    B --> M
    B --> N
```

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS + DaisyUI components
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Package Manager**: pnpm

### **Backend**
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs
- **Email Service**: Nodemailer
- **Development**: tsx, nodemon for hot reloading

### **Database Schema**
- **Users**: Authentication, profiles, and role management
- **Hotels**: Hotel information, locations, and ratings
- **Rooms**: Room details, pricing, and availability
- **Bookings**: Reservation management and status tracking
- **Payments**: Transaction records and payment status
- **Support**: Customer support ticket system

## 📋 Database Schema

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : makes
    USERS ||--o{ CUSTOMER_SUPPORT : creates
    HOTELS ||--o{ ROOMS : contains
    HOTELS ||--o{ BOOKINGS : receives
    ROOMS ||--o{ BOOKINGS : booked_in
    BOOKINGS ||--|| PAYMENTS : has
    
    USERS {
        int user_id PK
        string first_name
        string last_name
        string email UK
        string password
        string role
        boolean is_verified
        timestamp created_at
        timestamp updated_at
    }
    
    HOTELS {
        int hotel_id PK
        string name
        string location
        string address
        string contact_number
        string category
        int rating
        timestamp created_at
        timestamp updated_at
    }
    
    ROOMS {
        int room_id PK
        int hotel_id FK
        string room_number
        string room_type
        int price_per_night
        int capacity
        string amenities
        string availability
        timestamp created_at
        timestamp updated_at
    }
    
    BOOKINGS {
        int booking_id PK
        int user_id FK
        int hotel_id FK
        int room_id FK
        timestamp check_in_date
        timestamp check_out_date
        int total_amount
        string status
        timestamp created_at
        timestamp updated_at
    }
    
    PAYMENTS {
        int payment_id PK
        int booking_id FK
        int amount
        string payment_method
        string payment_status
        string transaction_id
        timestamp payment_date
    }
    
    CUSTOMER_SUPPORT {
        int ticket_id PK
        int user_id FK
        string subject
        string description
        string status
        timestamp created_at
        timestamp updated_at
    }
```

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18 or higher
- **PostgreSQL**: v13 or higher
- **pnpm**: v8 or higher (recommended) or npm
- **Git**: Latest version

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/kokya-hrbs.git
   cd kokya-hrbs
   ```

2. **Setup Backend**
   ```bash
   cd backend
   pnpm install
   
   # Create environment file
   cp .env.example .env
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   pnpm install
   ```

4. **Configure Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/kokya_hrbs
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # API Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Database Setup**
   ```bash
   cd backend
   
   # Create database (ensure PostgreSQL is running)
   createdb kokya_hrbs
   
   # Run migrations
   pnpm run migrate
   
   # Seed database with sample data
   pnpm run seed
   ```

6. **Start Development Servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   pnpm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   pnpm run dev
   ```

7. **Access the Application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3000
   - **API Documentation**: http://localhost:3000/api-docs (if implemented)

## 📖 API Documentation

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/auth/register` | User registration | `{ first_name, last_name, email, password }` |
| POST | `/auth/login` | User login | `{ email, password }` |
| POST | `/auth/verify` | Email verification | `{ email, verification_code }` |

### 🏨 Hotel Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/hotels` | Get all hotels | `?location=string&category=string` |
| GET | `/hotels/:id` | Get hotel by ID | `id: number` |

### 🛏️ Room Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/rooms` | Get all rooms | `?hotel_id=number&availability=string` |
| GET | `/rooms/:id` | Get room by ID | `id: number` |

### 📅 Booking Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/bookings` | Get user bookings | Headers: `Authorization: Bearer <token>` |
| GET | `/bookings/:id` | Get booking by ID | `id: number` |
| POST | `/bookings` | Create new booking | `{ hotel_id, room_id, check_in_date, check_out_date }` |

### 💳 Payment Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/payments` | Get payment history | Headers: `Authorization: Bearer <token>` |
| GET | `/payments/:id` | Get payment by ID | `id: number` |

### 🎫 Support Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/support/tickets` | Create support ticket | `{ subject, description }` |
| GET | `/support/tickets` | Get user tickets | Headers: `Authorization: Bearer <token>` |

## 🎯 User Workflow

### 1. **User Registration & Verification**
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant E as Email Service
    participant D as Database
    
    U->>F: Register with email/password
    F->>B: POST /auth/register
    B->>D: Create user (is_verified: false)
    B->>E: Send verification email
    E->>U: Verification email with code
    U->>F: Enter verification code
    F->>B: POST /auth/verify
    B->>D: Update user (is_verified: true)
    B->>F: Return JWT token
```

### 2. **Hotel Search & Booking**
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database
    
    U->>F: Search hotels by location
    F->>B: GET /hotels?location=...
    B->>D: Query hotels by location
    D->>B: Return hotel results
    B->>F: Hotel list with availability
    F->>U: Display hotels
    
    U->>F: Select hotel & view rooms
    F->>B: GET /rooms?hotel_id=...
    B->>D: Query available rooms
    D->>B: Return room list
    B->>F: Room details with pricing
    F->>U: Display rooms
    
    U->>F: Book selected room
    F->>B: POST /bookings
    B->>D: Create booking record
    B->>F: Booking confirmation
    F->>U: Show confirmation
```

## 🐳 Docker Setup

### Docker Compose Configuration

Create `docker-compose.yml` in the root directory:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: kokya_hrbs
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/kokya_hrbs
      JWT_SECRET: your-secret-key
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Quick Docker Start
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Run unit tests
pnpm test

# Run integration tests
pnpm test:integration

# Run test coverage
pnpm test:coverage

# Run specific test file
pnpm test auth.test.ts
```

### Frontend Testing
```bash
cd frontend

# Run component tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Run tests in watch mode
pnpm test:watch
```

### Test Structure
```
backend/tests/
├── unit/
│   ├── services/
│   ├── controllers/
│   └── utils/
├── integration/
│   ├── auth.test.ts
│   ├── hotels.test.ts
│   └── bookings.test.ts
└── fixtures/
    └── testData.ts

frontend/tests/
├── components/
├── pages/
└── e2e/
    ├── booking-flow.test.ts
    └── user-registration.test.ts
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure stateless authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Email Verification**: Prevents fake account creation
- **Role-Based Access**: User and admin permissions

### Data Protection
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **XSS Protection**: Input sanitization and output encoding
- **CORS Configuration**: Controlled cross-origin requests

### API Security
- **Rate Limiting**: Prevent API abuse and DDoS attacks
- **Request Size Limits**: Prevent large payload attacks
- **Helmet.js**: Security headers for Express.js
- **Environment Variables**: Sensitive data protection

### Rate Limiting Configuration
```typescript
// Backend rate limiting setup
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
}
```

## 📊 Performance & Monitoring

### Performance Optimizations
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Frontend Code Splitting**: Lazy loading with React.lazy()
- **Image Optimization**: Compressed and responsive images
- **Caching Strategy**: Redis for session and data caching

### Monitoring Setup
```bash
# Install monitoring dependencies
pnpm add express-status-monitor morgan winston

# Add to your Express app
app.use('/status', require('express-status-monitor')());
```

### Logging Configuration
```typescript
// Winston logger setup
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ],
});
```

## 💾 Backup & Recovery

### Database Backup
```bash
# Create backup
pg_dump -h localhost -U postgres -d kokya_hrbs > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql -h localhost -U postgres -d kokya_hrbs < backup_20241207_143000.sql

# Automated daily backup script
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U postgres -d kokya_hrbs > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -type f -mtime +7 -delete
```

### File Backup Strategy
- **Code Repository**: Git with remote repositories
- **Database**: Daily automated backups with retention policy
- **Environment Files**: Secure backup of configuration files
- **User Uploads**: Cloud storage backup for uploaded files

## ⚡ Scalability Considerations

### Horizontal Scaling
- **Load Balancing**: Multiple backend instances behind load balancer
- **Database Replication**: Read replicas for improved performance
- **CDN Integration**: Static asset delivery optimization
- **Microservices Architecture**: Service separation for better scaling

### Caching Strategies
```typescript
// Redis caching implementation
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

// Cache hotel search results
app.get('/hotels', async (req, res) => {
  const cacheKey = `hotels:${JSON.stringify(req.query)}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const hotels = await hotelService.getHotels(req.query);
  await redis.setex(cacheKey, 300, JSON.stringify(hotels)); // 5 minutes cache
  
  res.json(hotels);
});
```

### Performance Metrics
- **Response Time**: Target < 200ms for API endpoints
- **Throughput**: Support 1000+ concurrent users
- **Database Queries**: Optimized with proper indexing
- **Memory Usage**: Efficient memory management and cleanup

## 🚀 Production Deployment

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
DATABASE_URL=postgresql://user:password@production-db:5432/kokya_hrbs
JWT_SECRET=super-secure-production-secret
REDIS_URL=redis://production-redis:6379

# SSL Configuration
SSL_CERT_PATH=/path/to/ssl/cert.pem
SSL_KEY_PATH=/path/to/ssl/private.key

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=error
```

### Build & Deploy
```bash
# Backend production build
cd backend
pnpm run build
pm2 start dist/index.js --name "kokya-hrbs-api"

# Frontend production build
cd frontend
pnpm run build
# Deploy to CDN or static hosting

# Database migration in production
pnpm run migrate:prod
```

### Health Checks
```typescript
// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await db.select().from(UserTable).limit(1);
    
    // Check Redis connection
    await redis.ping();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      cache: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Reset database connection
pnpm run db:reset

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-15-main.log
```

#### Email Service Issues
```javascript
// Test email configuration
const testEmail = async () => {
  try {
    await emailService.sendVerificationCode('test@example.com', '123456');
    console.log('Email service working correctly');
  } catch (error) {
    console.error('Email service error:', error);
  }
};
```

#### Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check for conflicting dependencies
pnpm audit

# Update dependencies
pnpm update
```

### Debug Mode
```bash
# Enable debug mode
DEBUG=app:* pnpm run dev

# Database query logging
DATABASE_LOGGING=true pnpm run dev

# Verbose error reporting
NODE_ENV=development VERBOSE_ERRORS=true pnpm run dev
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow the configured rules
- **Prettier**: Code formatting
- **Conventional Commits**: Use conventional commit messages

### Pull Request Checklist
- [ ] Tests pass (`pnpm test`)
- [ ] Code follows style guidelines (`pnpm lint`)
- [ ] Documentation updated
- [ ] Database migrations included (if applicable)
- [ ] Security considerations addressed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

### Contact Information
- **Email**: support@kokya-hrbs.com
- **Website**: https://kokya-hrbs.com
- **GitHub**: https://github.com/your-username/kokya-hrbs

### Reporting Security Issues
For security-related issues, please email security@kokya-hrbs.com instead of creating a public issue.

## 🙏 Acknowledgments

- **Contributors**: Thanks to all contributors who help improve this project
- **Libraries**: Built with amazing open-source libraries
- **Community**: Inspired by the hotel booking industry and user feedback

---

<div align="center">

**[⬆ Back to Top](#-kokya-hrbs---hotel-room-booking-system)**

Made with ❤️ by the Kokya HRBS Team

</div>
