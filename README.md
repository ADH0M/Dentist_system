# 🦷 Dentist System

A comprehensive **Dental Clinic Management Web Application** built with modern web technologies, featuring role-based dashboards for managing patients, appointments, visits, invoicing, and dental imaging.

---

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19 |
| Database | MongoDB + Prisma 6 |
| State Management | Redux Toolkit |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Authentication | JWT (cookie-based with jose) |
| Image Storage | Cloudinary |
| Validation | Zod |
| Icons | Lucide React, React Icons |

---

## 🏗️ Features

- 🔐 **Role-based Authentication** - Secure JWT cookie-based auth
- 👥 **User Management** - Admin dashboard for staff accounts
- 🏥 **Patient Management** - Registration & medical records with allergies/medications
- 🦷 **Tooth Chart Visualization** - Interactive dental charting per visit
- 📅 **Appointment Scheduling** - Link patients to dentists
- 📋 **Visit Management** - Clinical notes, diagnosis, treatment plans
- 💰 **Invoice Generation** - Billing linked to visits
- 🖼️ **Radiology Imaging** - Cloud-based dental X-rays (Cloudinary)
- ✅ **Task Management** - Internal staff task assignments
- 📊 **Activity Logging** - Complete audit trail

---

## 👥 User Roles

- **Admin** - System management, user accounts
- **Dentist** - Patient treatment, clinical visits
- **Assistant** - Support workflow
- **Receptionist** - Scheduling, patient check-in
- **Patient** - Self-service portal

---

## 🗄️ Database Models (MongoDB/Prisma)

```
User ────── Patient (1:1)
    │
    ├── Appointment ───── Visit (1:1)
    │         │
    │         └── Invoice (1:1)
    │
    ├── Task
    │
    └── ActivityLog
```

| Model | Description |
|-------|-------------|
| User | Staff & patient accounts |
| Patient | Medical records (linked 1:1 to User) |
| Visit | Clinical visits with tooth charting |
| Appointment | Scheduling |
| Invoice | Billing |
| Task | Staff tasks |
| RadiologyImage | Dental X-rays |
| ActivityLog | Audit trail |

### Enums

- **UserType**: admin, dentist, assistant, receptionist, patient
- **VisitType**: Initial, FollowUp, Emergency, Cleaning, Consultation, Surgery
- **AppointmentStatus**: scheduled, confirmed, in_progress, completed, cancelled, no_show
- **PaymentStatus**: pending, paid, partially_paid, refunded, insurance_pending

---

## 📁 Project Structure

```
app/                    # Next.js App Router
  (auth)/              # Login & Register
  (dashboard)/         # Role-based dashboards
    admin/             # Admin + user management
    doctor/            # Dentist patient view
    assistant/         # Assistant view
    receptionist/     # Receptionist workflow
    patient/           # Patient portal
  api/                 # API routes
components/            # React components
  ui/                  # shadcn/ui primitives
  patient/            # Patient components
  visit/               # Visit components
  tooth-chart/         # Dental charting
lib/                   # Server actions, db connection
store/                 # Redux store
generated/prisma/     # Auto-generated Prisma client
prisma/                # Database schema
```

---

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma db push` | Sync schema to MongoDB |

---

## Environment Variables

Required environment variables (see `.env`):

- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - Authentication secret key
- `CLOUDINARY_*` - Cloudinary credentials for image uploads

