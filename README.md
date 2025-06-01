# Aliphone - Fullstack B2B phone ecommerce

A modern web application built to showcase a catalog of realistic mobile phones, providing users with a seamless Browse and detailed viewing experience.

## 🌟 About This Project (Portfolio & Learning Focus)

## ✨ Features

- **Product Listing:** A responsive homepage displaying a grid of realistic mobile phones with their name, price, and a thumbnail image.
- **Product Details:** A dedicated page for each product, offering an in-depth view including name, full description, detailed specifications, price, and a larger image.
- **Clean Code:** Adherence to high code quality standards through consistent linting, formatting, a modular folder structure, and descriptive comments for complex logic.
- **Bun Runtime:** Leverages the speed and efficiency of Bun for dependency management and potentially for server-side logic.
- **Database:** A well-structured database to store and manage product information.
- **Live Deployment:** The application is publicly deployed for easy access.
- **Product Search:** Ability to search products by keyword.
- **Advanced Product Browse:** Features for sorting, filtering, and pagination of products based on various criteria.
- **Product Categories:** Organization of products into distinct categories for easier navigation.
  <!-- - **User Authentication & Authorization:** Basic implementation of user sign-up, login, and role-based access control. -->
  <!-- - **Shopping Cart & Checkout:** A complete flow for adding products to a cart and proceeding through a checkout process. -->
  <!-- - **Admin Dashboard:** A dedicated interface for administrators to manage products, monitor transactions, and oversee application data. -->

## 🚀 Live Demo

You can view the live application here:
[**https://shop.obbylee.com/**]

---

### Latest Features & Development Progress

For the very latest features, bug fixes, and ongoing development work, please **always refer to the `development` branch**. The `main` branch is primarily for stable releases and may not reflect the most recent updates.

## 🛠️ Technologies Used

- **Runtime & Package Manager:** **Bun**
- **Frontend:** **React** with **React Router v7** (following the latest conventions and practices)
- **Styling:** **Tailwind CSS** with **shadcn/ui**
- **Schema Validation:** **Zod**
- **Backend Framework:** **Hono**
- **API Layer:** **tRPC**
- **ORM:** **Prisma**
- **Database:** **PostgreSQL**
  - **Authentication (Optional):** **Better Auth**
  <!-- * **Monorepo Tool (Optional):** **Turborepo** -->
- **Containerization:** **Docker Compose** (primarily for local database setup)
- **Tools:** **ESLint** with **Prettier**
- **Deployment:** **Vercel**

---

## 📦 Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Bun:** Follow the official Bun installation guide: [https://bun.sh/docs/installation](https://bun.sh/docs/installation)
- **Git:** [https://git-scm.com/downloads](https://git-scm.com/downloads)

### 1. Clone the Repository

```bash
git clone https://github.com/obbylee/phone-ecommerce.git
cd phone-ecommerce
```

### 2. Install Dependencies

This project has separate dependencies for the frontend and backend. Navigate into each directory and install them using Bun.

```bash
cd app/web
bun install
cd ../server
bun install
cd ../.. # Go back to the project root
```

### 3. Database Setup

This project uses PostgreSQL, managed locally via Docker Compose.

### 3.1. Environment Variables

Create a .env file in the app/server directory based on the .env.example provided. This will typically contain your database connection string and any other backend-specific variables.

```code
# app/server/.env.example
CORS_ORIGIN="http://localhost:5173"

DATABASE_URL="postgresql://aliphone:888888@localhost:5432/aliphonedb"
POSTGRES_HOST_PORT="5432"
POSTGRES_USER="aliphone"
POSTGRES_PASSWORD="888888"
POSTGRES_DB="aliphonedb"
```

### Frontend (app/web/.env)

Create a .env file in the app/web directory to configure the frontend's API endpoint.

```bash
# app/web/.env.example
VITE_SERVER_URL="http://localhost:3000" # Update if your backend runs on a different port
```

### 3.2. Start Database Container

Make sure you currently at app/server, start the PostgreSQL database container:

```bash
# current directory app/server
bun db:docker #running docker-compose up -d
```

### 3.3. Run Migrations & Seed Data

Ensure your PostgreSQL container is running. Then, apply the database schema migrations and seed it with initial product data using Prisma. Run these commands from the app/server directory.

```bash
# current directory app/server

# Apply database migrations
bun db:migrate # This typically runs `npx prisma migrate dev` or similar

# prisma generate
bun db:generate

# Seed the database with product data
bun db:seed # This typically runs `npx prisma db seed` or a custom script

cd ../.. # Go back to the project root
```

### Database Schema:

The database schema, managed by Prisma, is defined in app/server/prisma/schema.prisma.

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "./generated/prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id
  name          String
  email         String
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime
  sessions      Session[]
  accounts      Account[]
  carts         Cart[] // Relation to Cart model

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime
  updatedAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime
  updatedAt             DateTime

  @@map("account")
}

model Verification {
  id         String    @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime?
  updatedAt  DateTime?

  @@map("verification")
}

model ProductCategory {
  id          String    @id @default(ulid())
  name        String    @unique
  slug        String    @unique
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  products    Product[] // Relation to Product model

  @@map("product_category")
}

model Product {
  id                   String   @id @default(ulid())
  sku                  String   @unique
  slug                 String   @unique
  name                 String
  description          String
  price                Decimal
  imageUrl             String?
  stockQuantity        Int
  minimumOrderQuantity Int
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  isFeatured           Boolean  @default(false)
  isActive             Boolean  @default(true)

  // Relation to ProductCategory
  categoryId String?
  category   ProductCategory? @relation(fields: [categoryId], references: [id])

  cartItems CartItem[] // Relation to CartItem model

  @@map("product")
}

model Cart {
  id        String     @id @default(ulid())
  userId    String     @unique // Each user can only have one active cart
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  items     CartItem[] // Relation to CartItem model

  @@map("cart")
}

model CartItem {
  id        String   @id @default(ulid())
  cartId    String
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantity  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([cartId, productId]) // Ensures a product is only once in a given cart
  @@map("cart_item")
}
```

### 4. Run the Application

You'll need to start both the backend server and the frontend development server.

### 4.1. Start the Backend

Open a new terminal window and navigate to the `app/server` directory:

```bash
bun dev
```

The backend server should now be running, typically on `http://localhost:3000`

### 4.2 Start the Frontend

In your original terminal window, navigate to the app/web directory:

```bash
cd app/web
bun run dev
```

The frontend application should now be running at http://localhost:5173

### 📂 Project Structure

```
.
├── app/
│   ├── server/             # Backend application
│   │   ├── api/            # Vercel entry point
│   │   ├── prisma/         # Prisma schema, migrations, and seed scripts
│   │   ├── src/            # Backend source code
│   │   │   ├── lib/        # Shared utilities, trpc
│   │   │   ├── routers/        # routers
│   │   │   └── index.ts    # Backend entry point
│   │   ├── .env.example    # Example backend environment variables
│   │   ├── .env            # Local backend environment variables
│   │   ├── package.json    # Backend dependencies and scripts
│   │   ├── .prettierrc    # Prettier configuration

│   │   ├── compse.yml    # Backend dependencies and scripts
│   │   └── bun.lockb       # Backend Bun lockfile
│   └── web/                # Frontend application
│       ├── public/         # Frontend static assets
│       ├── app/            # Frontend source code
│       │   ├── components/ # Reusable UI components (shadcn/ui setup)
│       │   ├── routes/      # React Router v7 routes
│       │   ├── lib/        #  tailwindcss css config
│       │   ├── api/        # tRPC client setup
│       │   ├── utils/     # Trpc setting, and others utility function
│       │   └── root.tsx    # Frontend entry point
│       ├── .env.example    # Example frontend environment variables
│       ├── .env            # Local frontend environment variables
│       ├── package.json    # Frontend dependencies and scripts
│      ├── .prettierrc    # Prettier configuration
│       └── bun.lockb       # Frontend Bun lockfile
└── README.md               # This file
```

---

### 💭 Development Decisions & Challenges

---

#### Key Development Decisions

- **Monorepo-like Structure**: Separating frontend (app/web) and backend (app/server) for clear concerns and independent scaling, while keeping them in one repository for easier management.
- **Bun for Speed**: Chosen for its exceptional speed in dependency installation and script execution, significantly improving development and build times, and offering native TypeScript support.
- **End-to-End Type Safety**: Achieved using Prisma for database typing, tRPC for type-safe API contracts between backend (Hono) and frontend (React), and Zod for robust schema validation. This setup drastically reduces runtime errors.
- **Component-Driven UI**: Built with React and React Router v7 for modularity. Tailwind CSS with shadcn/ui provides a utility-first, high-quality, and accessible component library for rapid UI development.
- **Hono for Lightweight Backend**: Selected for its speed and minimal overhead, making it an ideal choice for a performant API server with tRPC.

#### Challenges Encountered & Learned Lessons

- **Vercel Deployment with Bun, Prisma, and tRPC**:

  - **Challenge**: Initial deployment to Vercel was complex due to configuring Bun, Prisma client generation, and tRPC with a monorepo-like structure.
  - **Lesson Learned**: learned to meticulously configure vercel.json with specific installCommand and buildCommand for both app/web and app/server. Ensuring Prisma client generation and correct database environment variable passing during Vercel's build process was crucial. This deepened our understanding of Vercel's build pipeline for non-standard runtimes.

* **Learning & Integrating tRPC with Hono:**
  - **Challenge:** As a newly learned technology, integrating **tRPC** into our Hono backend from scratch involved a steep learning curve and understanding its core concepts.
  - **Lesson Learned:** By building a well-structured **tRPC** within our Hono application, we successfully enabled every tRPC resolver to securely receive necessary resources. This hands-on experience solidified our understanding of tRPC's power in maintaining end-to-end type safety and efficient resource management across the API layer.

- **Work in Progress: Better Auth & Turborepo Workspaces:**
  - **Current State:** We're actively working on integrating **Better Auth** for a comprehensive authentication solution and transitioning to a full **Turborepo** monorepo workspace. These efforts aim to further streamline our development workflow and optimize build performance.

🤝 Contributing
Contributions are welcome! If you have suggestions for improvements or find a bug, please open an issue or submit a pull request.
