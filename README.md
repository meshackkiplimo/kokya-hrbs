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

5. *
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


