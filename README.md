# 🎓 School Management & Billing System

A modern, secure, and role-based School Management and Billing System built with Next.js, PostgreSQL, DaisyUI, and Framer Motion.

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5.5-green)
![Prisma](https://img.shields.io/badge/Prisma-7.2-orange)

## ✨ Features

### 👥 **Role-based Access Control**
- **Admin**: Full system access and management
- **Accountant**: Billing and payment management
- **Teacher**: Attendance and marks management

### 📚 **Core Modules**
- **Student Management**: CRUD operations with class assignments
- **Teacher Management**: Staff management with subject assignments
- **Class Management**: Organize classes and sections
- **Attendance System**: Daily attendance marking by teachers
- **Marks Management**: Grade entry by subject and exam type
- **Billing & Payments**: Cash-based fee collection with status tracking
- **Reports Dashboard**: Income reports, due students, class summaries

### 🎨 **Modern UI/UX**
- **DaisyUI Components**: Beautiful, consistent design system
- **Framer Motion**: Smooth animations and transitions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Automatic theme switching
- **Professional Cards**: Modern card-based layouts

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router) - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **DaisyUI** - Component library
- **Framer Motion** - Animation library
- **Lucide React** - Icons

### Backend
- **Next.js Server Actions** - API routes
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Database
- **bcryptjs** - Password hashing
- **Custom Authentication** - Session-based auth

### Deployment
- **Vercel** - Hosting platform
- **Neon/Supabase** - PostgreSQL hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd school-management-system
npm install
```

### 2. Database Setup
```bash
# Set up your database URL in .env
DATABASE_URL="postgresql://username:password@host:port/database"

# Run migrations
npx prisma db push

# Seed with test data
npm run db:seed
```

### 3. Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@school.com` | `admin123` |
| Accountant | `accountant@school.com` | `accountant123` |
| Teacher | `teacher@school.com` | `teacher123` |

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── dashboard/
│   │   ├── students/
│   │   ├── teachers/
│   │   ├── classes/
│   │   ├── fees/
│   │   ├── attendance/
│   │   ├── marks/
│   │   └── reports/
│   └── layout.tsx
├── components/
│   ├── ui/           # Reusable UI components
│   └── DashboardClient.tsx
├── lib/
│   ├── auth.ts       # Authentication utilities
│   └── prisma.ts     # Database client
└── prisma/
    ├── schema.prisma # Database schema
    └── seed.ts       # Test data seeding
```

## 🚀 Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit: School Management System"
git push origin main
```

### 2. Deploy on Vercel
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   ```
5. Deploy!

### 3. Database Migration
After deployment, run:
```bash
npx prisma migrate deploy
```

## 🔧 Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

## 📊 Database Schema

- **Users**: Authentication and roles
- **Teachers**: Staff information and assignments
- **Students**: Student records and enrollments
- **Classes**: Class organization
- **Fees**: Billing records
- **Payments**: Payment transactions
- **Attendance**: Daily attendance records
- **Marks**: Grade entries

## 🎯 Key Features in Detail

### For Administrators
- Complete student and teacher management
- Class and subject organization
- Fee structure setup
- Comprehensive reporting
- System configuration

### For Accountants
- Fee generation and management
- Payment processing and recording
- Invoice generation
- Financial reporting
- Due payment tracking

### For Teachers
- Class attendance marking
- Student grade entry
- Subject-wise performance tracking
- Class management overview

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [DaisyUI](https://daisyui.com/) - Component library
- [Framer Motion](https://framer.com/motion) - Animation library
- [Prisma](https://prisma.io/) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
