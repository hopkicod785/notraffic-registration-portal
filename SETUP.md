# Quick Setup Instructions

## 1. Create Environment Variables File

Create a `.env.local` file in the root directory with the following content:

```env
# Supabase Configuration (Replace with your actual values)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourcompany.com
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
```

## 2. Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the commands from `database-schema.sql`
3. Copy your project URL and anon key from Settings > API
4. Update the `.env.local` file with your actual Supabase credentials

## 3. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or 3001 if 3000 is busy).

## 4. Test the Application

### Public Features
- Visit the landing page
- Test installation registration form
- Test mobility OS account registration

### Admin Features
- Go to `/admin`
- Login with your admin credentials
- Test the dashboard and management features

## Default Admin Credentials (if no .env.local file)

- Email: `admin@example.com`
- Password: `admin123`

**Important**: Change these credentials in production!

## Troubleshooting

### If you see Supabase errors:
- Make sure you've created the `.env.local` file
- Verify your Supabase URL and key are correct
- Check that the database tables were created successfully

### If forms don't submit:
- Check the browser console for errors
- Verify Supabase connection
- Check that RLS policies allow public access

## Next Steps

1. Set up your Supabase project
2. Configure environment variables
3. Test all functionality
4. Deploy to production (see DEPLOYMENT.md)
