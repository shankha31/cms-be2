
# Next.js + Prisma Project

This project is built using [Next.js](https://nextjs.org/) as the React framework and [Prisma](https://www.prisma.io/) as the database ORM (Object Relational Mapper).

## Project Setup

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher recommended)
- [NPM](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- A supported database (e.g., PostgreSQL, MySQL, SQLite, etc.)


### Prisma Setup

1. Create a `.env` file at the root of your project with your database connection URL:
   ```
   DATABASE_URL="your-database-connection-url"
   ```

2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Apply database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
   This command creates a new migration file and updates your database schema.

### Development Server

Start the development server:
```bash
npm run dev
# or
yarn dev
```

Your application should now be running at [http://localhost:3000](http://localhost:3000).

### Project Structure

- **`/pages`**: Next.js pages (each file in this directory becomes a route)
- **`/prisma`**: Prisma schema file (e.g., `schema.prisma`) and migration files
- **`/components`**: Reusable React components
- **`/lib`**: Utility functions and helpers
- **`.env`**: Environment variables

### Prisma Commands

- **Generate Prisma Client**: `npx prisma generate`
- **Create Migration**: `npx prisma migrate dev --name <migration-name>`
- **Apply Migrations**: `npx prisma migrate deploy`
- **Open Prisma Studio**: `npx prisma studio` (a visual interface for database management)

### Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema)
