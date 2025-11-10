# 🚀 Blockchain Developer Portfolio & Brand Website

A modern, full-stack portfolio website with admin panel for blockchain developers. Features include project showcase, services, courses, blog, and subscription-based content management.

## ✨ Features

### Public Website
- 🎨 Modern, clean UI/UX with smooth animations
- ⚡ Lightning-fast performance (Next.js 14+ App Router)
- 📱 Fully responsive (mobile-first design)
- 🔗 Web3 wallet integration ready
- 📊 Dynamic content loading
- 🎯 SEO optimized
- 💬 Contact form with database storage
- 📝 Blog support (ready to implement)
- 🎓 Course platform structure
- 💼 Portfolio showcase with filtering

### Admin Panel
- 🔐 Secure authentication (NextAuth.js)
- 📊 Dashboard with analytics
- ✍️ Content Management System (CMS)
- 👥 User management ready
- 📈 Analytics & insights structure

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router, React 19)
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **Web3**: ethers.js / wagmi + RainbowKit
- **Icons**: Lucide React

### Backend
- **Framework**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Payment**: Stripe (configured)

### DevOps & Tools
- **Type Safety**: TypeScript
- **Linting**: ESLint
- **Version Control**: Git + GitHub

## 📁 Project Structure

```
my-portfolio/
├── app/                          # Next.js App Router
│   ├── (public)/                # Public routes
│   │   ├── about/
│   │   ├── portfolio/
│   │   └── contact/
│   ├── (admin)/                 # Admin routes
│   │   └── dashboard/
│   ├── api/                     # API routes
│   │   ├── auth/
│   │   ├── projects/
│   │   └── contact/
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── layout/                  # Layout components
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   └── home/                    # Home page sections
├── lib/                         # Utility functions
│   ├── db.ts                   # Database connection
│   ├── auth.ts                 # Auth configuration
│   ├── utils.ts                # Helper functions
│   └── validations.ts          # Zod schemas
├── prisma/                      # Database schema
│   └── schema.prisma
├── types/                       # TypeScript types
└── public/                      # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd my-portfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env.local` file in root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl"

# Email (Optional)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"

# Payment (Optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Web3 (Optional)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="your-project-id"
```

4. **Set up database**

Note: Prisma engine download may require network access. If you encounter issues, the schema is already set up.

```bash
# Generate Prisma client (if possible)
npx prisma generate

# Run migrations (when database is available)
npx prisma migrate dev --name init

# Seed the database with initial data (including admin user)
npx tsx prisma/seed.ts
# OR if tsx is not installed globally:
npm run db:seed
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🔐 Admin Access

After seeding the database, you can access the admin panel:

- **Admin Login URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@basantsd.com`
- **Password**: `admin123`

**⚠️ IMPORTANT**: Change the admin password immediately after first login!

**Note**: If you encounter "Invalid email or password" error:
1. Make sure you've run the database seed command: `npx tsx prisma/seed.ts`
2. Verify your database connection in `.env.local`
3. Check that the admin user exists in your database

The admin and regular user login systems are differentiated by:
- **Admin users**: Have `role: "ADMIN"` in the database and can access `/dashboard`
- **Regular users**: Have `role: "USER"` and access different areas of the site
- Both use the same authentication system but are redirected to different areas based on their role

## 📋 Database Schema

The project includes a comprehensive Prisma schema with:
- User authentication (NextAuth.js compatible)
- Projects management
- Blog posts
- Courses with modules and lessons
- Services
- Newsletter subscriptions
- Contact messages
- Payment subscriptions

See `prisma/schema.prisma` for full details.

## 🎨 Pages Overview

### Public Pages
- **Home** (`/`) - Hero, featured projects, services, tech stack, CTA
- **About** (`/about`) - Bio, skills, experience, education
- **Portfolio** (`/portfolio`) - Projects showcase with search and filtering
- **Contact** (`/contact`) - Contact form with validation
- **Services** (structure ready)
- **Blog** (structure ready)
- **Courses** (structure ready)

### Admin Pages
- **Dashboard** (`/dashboard`) - Analytics and quick actions
- Other admin pages (structure ready)

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

### Adding New Components

This project uses shadcn/ui. Core components are already included:
- Button, Card, Input, Textarea, Label, Badge

To add more components, manually create them in `components/ui/`.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables on Vercel
Add all variables from `.env.example` in:
Settings → Environment Variables

### Database Setup
1. Set up PostgreSQL database (Supabase, Railway, or PlanetScale recommended)
2. Add `DATABASE_URL` to environment variables
3. Run migrations: `npx prisma migrate deploy`

## 📝 Customization

### Branding
Update the following:
- Logo and name in `components/layout/navbar.tsx`
- Footer information in `components/layout/footer.tsx`
- Metadata in `app/layout.tsx`
- Social links throughout

### Content
- Update project data in pages
- Modify color scheme in `tailwind.config.ts`
- Customize components to match your brand

## 🔐 Security

- ✅ Input validation with Zod
- ✅ SQL injection protection (Prisma)
- ✅ Environment variables for secrets
- ✅ Authentication ready (NextAuth.js)
- 🔄 Rate limiting (to be implemented)
- 🔄 CSRF protection (to be implemented)

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Prisma](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 Support

For questions or issues:
- Open an issue on GitHub
- Contact: contact@basantsd.com

## 📄 License

MIT License - feel free to use this for your own portfolio!

---

**Built with ❤️ by Basant Singh Dobal**

🚀 Happy Coding!
