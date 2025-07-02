# Hotel Room Management System Backend

## Technology Stack

- TypeScript
- Express.js
- Drizzle ORM
- PostgreSQL

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   cd backend
   pnpm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the `backend` directory.
   - Add your PostgreSQL connection string:
     ```
     DATABASE_URL=postgres://user:password@localhost:5432/hotel_db
     ```

4. **Set up the database**
   - Ensure PostgreSQL is running and a database is created.
   - (Planned) Run Drizzle migrations:
     ```bash
     # Placeholder for migration command
     ```

5. **Start the development server**
   ```bash
   pnpm run dev
