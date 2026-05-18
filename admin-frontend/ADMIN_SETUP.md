# Admin Frontend Setup

This is the dedicated admin frontend for the Library Management System.

## Setup Instructions

### 1. Install Dependencies

The admin-frontend has already been configured with all necessary dependencies. If you haven't run the install-all command from the root, run:

```bash
npm install
```

### 2. Copy Assets

The admin-frontend needs image assets from the frontend folder. Copy the following files:

**From**: `frontend/src/assets/`
**To**: `admin-frontend/src/assets/`

Files to copy:
- `Logo.png`
- `books1.png`
- `books2.png`
- `books3.png`
- `books4.png`

**From**: `frontend/public/`
**To**: `admin-frontend/public/`

Files to copy:
- `icons.svg`

### 3. Run Development Server

```bash
npm run dev
```

The admin frontend will start on `http://localhost:5174` (default Vite port, may vary if port is in use).

### 4. Build for Production

```bash
npm run build
```

### 5. Deploy to Vercel

1. Push your code to a Git repository
2. Connect the repository to Vercel
3. In Vercel dashboard, set the root directory to `admin-frontend`
4. Vercel will auto-detect the Vite configuration and build correctly

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Routes

- `/` - Redirects to `/loginAdmin`
- `/loginAdmin` - Admin login page
- `/AdminDashboard` - Main admin dashboard with full management interface

## Environment Variables

No environment variables are currently required for local development. For production, if you need to connect to the backend API, add:

```
VITE_API_URL=your_backend_api_url
```

## Features

- **Dashboard**: View library statistics and key metrics
- **Book Management**: Add, edit, delete, and manage books
- **Student Accounts**: View and manage student accounts
- **Borrow/Reserve Reports**: Track all borrowing and reservation activities
- **Category Filtering**: Filter books by course category
- **Search**: Search books and students
- **PDF Reports**: Download reports as PDF
- **Responsive Design**: Mobile-friendly interface

## Troubleshooting

### Images not loading?
Make sure you've copied the asset files from the frontend folder to the admin-frontend/src/assets/ directory.

### Port already in use?
Vite will automatically use the next available port if 5174 is in use. Check the terminal output for the actual URL.

### Dependencies not found?
Run `npm install` to ensure all dependencies are installed.
