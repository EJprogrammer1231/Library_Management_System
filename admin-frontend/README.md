# Admin Frontend - Library Management System

A dedicated React admin interface for managing the Library Management System. This is a separate frontend from the student interface, allowing independent deployment and management.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Copy Assets
Before running, copy the required assets from the main frontend:
- Copy `frontend/src/assets/*.png` to `admin-frontend/src/assets/`
- Copy `frontend/public/icons.svg` to `admin-frontend/public/`

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for detailed setup instructions.

### 3. Run Development Server
```bash
npm run dev
```

Access the admin dashboard at `http://localhost:5174` (or the port shown in terminal)

## Features

✨ **Dashboard Overview**
- Real-time library statistics
- Books available, borrowed, reserved counts
- Quick access to all management functions

📚 **Book Management**
- Add new books to the library
- Edit book details (title, author, copies, category)
- Delete books
- Change book status
- Track borrowed and reserved copies

👥 **Student Management**
- View all registered student accounts
- Search and filter students
- Delete student accounts
- Track student information (name, email, course, year level)

📊 **Reports & Analytics**
- Generate borrow and reservation reports
- Download reports as PDF
- Track all library transactions
- View detailed transaction history

🔍 **Search & Filter**
- Search books by title or author
- Search students by name or email
- Filter books by category (BSIT, BSCS, BSBA, BSED, BEED, BSTM, BSHM, General)

## Architecture

- **Framework**: React 19.2.4 with React Router 7.14.1
- **Build Tool**: Vite 8.0.13 (fast HMR and builds)
- **Styling**: Tailwind CSS 4.2.2
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: Browser localStorage (development) / Backend API (production)

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Redirect | Redirects to login |
| `/loginAdmin` | LoginAdmin | Admin authentication page |
| `/AdminDashboard` | AdminDashboard | Main admin interface |

## Configuration Files

- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS plugins
- `eslint.config.js` - ESLint rules
- `package.json` - Dependencies and scripts

## Environment Setup

### Development
- Node.js 18+ recommended
- npm or yarn package manager
- Modern browser with ES6+ support

### Production
- Deploy to Vercel, Netlify, or other static hosting
- Backend API URL may need to be configured via environment variables
- Ensure CORS is configured on backend

## Available Scripts

```bash
npm run dev          # Start development server (localhost:5174)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run format       # Format code with Prettier (if configured)
```

## Project Structure

```
admin-frontend/
├── src/
│   ├── main.jsx              # React app entry point
│   ├── index.css             # Global styles
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminDashboard.jsx    # Main dashboard
│   │   └── auth/
│   │       └── LoginAdmin.jsx        # Login form
│   ├── services/
│   │   ├── libraryBooks.js   # Book management logic
│   │   └── userProfile.js    # User profile logic
│   └── assets/               # Images (need to be copied)
├── public/                   # Static files
├── index.html               # HTML entry point
├── vite.config.js
├── tailwind.config.js
├── package.json
└── ADMIN_SETUP.md           # Detailed setup guide
```

## Database & Backend

Currently uses browser localStorage for development. For production:
- Connect to MongoDB backend via Express.js API
- Shared backend with student frontend
- Backend handles authentication and data persistence

## Deployment to Vercel

1. Push code to Git repository
2. Import project in Vercel dashboard
3. Set root directory to `admin-frontend`
4. Vercel auto-detects Vite configuration
5. Deploy!

## Next Steps

1. ✅ Setup complete - all core files created
2. 📋 Copy assets from frontend folder (images and icons)
3. 🚀 Run `npm install` to install dependencies
4. 💻 Run `npm run dev` to start development
5. 📦 Build and deploy to Vercel when ready

## Troubleshooting

**Q: Images not showing?**
A: Copy the PNG files from `frontend/src/assets/` to `admin-frontend/src/assets/`

**Q: Port 5174 already in use?**
A: Vite will use the next available port. Check terminal for the actual URL.

**Q: Can't find modules?**
A: Run `npm install` to install all dependencies.

**Q: Routes not working?**
A: Make sure you're accessing `/loginAdmin` first, or check browser console for errors.

## Support

For issues or questions, refer to the [ADMIN_SETUP.md](./ADMIN_SETUP.md) file for detailed setup instructions and troubleshooting steps.
