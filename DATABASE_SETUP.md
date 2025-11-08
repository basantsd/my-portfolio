# 🗄️ Database Setup Instructions

This guide will help you set up the PostgreSQL database and seed it with initial data.

## Prerequisites

- PostgreSQL installed and running on your system
- Database credentials (already configured in `.env.local`)

## Step-by-Step Setup

### 1. Verify Database Connection

The database URL is already configured in `.env.local`:
```
DATABASE_URL="postgresql://basantsingh:helloH321@localhost:5432/my_portfolio"
```

Make sure PostgreSQL is running on your system.

### 2. Generate Prisma Client

```bash
npm run db:generate
```

This command generates the Prisma client based on your schema.

### 3. Run Database Migrations

```bash
npm run db:migrate
```

This will:
- Create all the necessary tables in your database
- Set up relationships and indexes
- Apply the schema defined in `prisma/schema.prisma`

When prompted, enter a migration name (e.g., "init" or "initial_setup")

### 4. Seed the Database

```bash
npm run db:seed
```

This will populate your database with:
- ✅ **Admin User** for login
- ✅ **Sample Projects** (4 blockchain projects)
- ✅ **Blog Posts** (3 articles)
- ✅ **Courses** (2 courses)
- ✅ **Services** (3 service offerings)

### 5. Verify Setup

After seeding, you should see:

```
🌱 Starting database seed...
✅ Admin user created: admin@basantsd.com
✅ Projects seeded
✅ Blog posts seeded
✅ Courses seeded
✅ Services seeded
🎉 Database seeded successfully!

📧 Admin Login Credentials:
Email: admin@basantsd.com
Password: admin123

⚠️  Please change the password after first login!
```

## 🔐 Admin Login Credentials

**Email:** `admin@basantsd.com`
**Password:** `admin123`

**⚠️ IMPORTANT:** Change this password immediately after first login in production!

## 📊 Database Studio (Optional)

To view and manage your database visually:

```bash
npm run db:studio
```

This opens Prisma Studio in your browser at `http://localhost:5555`

## 🔄 Reset Database (If Needed)

If you need to start fresh:

```bash
# Drop all tables and recreate
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Run all migrations
# 4. Run the seed script automatically
```

## 🚀 Start Development Server

After database setup is complete:

```bash
npm run dev
```

Visit:
- **Home:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Dashboard:** http://localhost:3000/dashboard (requires login)

## ✅ Verification Checklist

- [ ] PostgreSQL is running
- [ ] `.env.local` file exists with correct DATABASE_URL
- [ ] Prisma client generated successfully
- [ ] Migrations completed without errors
- [ ] Database seeded with sample data
- [ ] Can login with admin credentials
- [ ] Can access dashboard after login
- [ ] Can see projects, blog posts, and courses on public pages

## 🔧 Troubleshooting

### Error: "Can't reach database server"
- Make sure PostgreSQL is running
- Verify database credentials in `.env.local`
- Check if database `my_portfolio` exists

### Error: "Prisma engine download failed"
- Run with: `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npm run db:generate`
- Or download engines manually from Prisma releases

### Error: "Table already exists"
- Run `npx prisma migrate reset` to start fresh
- Or manually drop tables and run migrations again

### Seed fails with duplicate key error
- Tables already have data
- Run `npx prisma migrate reset` to clear and reseed

## 📚 Additional Commands

```bash
# View database schema
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Generate SQL for migrations without applying
npx prisma migrate dev --create-only

# Apply pending migrations
npx prisma migrate deploy
```

## 🔒 Security Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Change default password** - The admin password is for development only
3. **Use strong passwords** - In production, use complex, unique passwords
4. **Enable SSL** - For production databases, always use SSL connections
5. **Regular backups** - Set up automated database backups

## 📝 Next Steps

After successful database setup:

1. Login to `/login` with admin credentials
2. Access the dashboard at `/dashboard`
3. Customize the seeded data
4. Add your own projects, blog posts, and courses
5. Change the admin password
6. Deploy to production with proper environment variables

---

**Need Help?** Check the main README.md or open an issue on GitHub.
