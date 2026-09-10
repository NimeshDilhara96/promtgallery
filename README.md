# AI Prompt Gallery - Next.js Migration

This is a production-ready Next.js App Router application built as a direct migration from a PHP/MongoDB backend. It preserves all existing functionality, database structures, and Bootstrap styling.

## Technologies Used
- Next.js (App Router, Server Components, Server Actions)
- TypeScript
- MongoDB & Mongoose
- Bootstrap 5.3.2
- Next.js Image Optimization
- GridFS (for handling new image uploads)

## Requirements
- Node.js 18+
- MongoDB 4.4+ (Local or Atlas)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/ai_prompt_gallery
SESSION_SECRET=your_super_secret_session_key_change_in_production
NODE_ENV=development
```
*(If using MongoDB Atlas, replace the URI with your connection string)*

3. Copy existing images:
If migrating from the old PHP app, copy all files from the old `image/` directory into `public/image/`. This ensures legacy prompts resolve their images correctly.

## Running the Application

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

## Admin Features
- Secure Authentication using `bcrypt` and HTTP-only JWT cookies.
- Admin Panel: `http://localhost:3000/admin/login`
- Use the same credentials as the previous PHP application (hashed passwords are fully backward-compatible).

## Data Integrity
- The MongoDB collections (`prompts`, `admins`) are mapped exactly as they were in the PHP app.
- No documents were overwritten or deleted during migration.
- `last_login`, `views`, and `copies` stats continue to update accurately.

## SEO & Accessibility
- Dynamic Metadata and JSON-LD is preserved for prompt details pages (`/prompt/[slug]`).
- Automatic `sitemap.xml` and `robots.txt` generation.
- Responsive UI preserved from original Bootstrap implementation.