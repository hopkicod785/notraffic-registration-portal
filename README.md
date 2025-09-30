# Vehicle Detection System Registration Portal

A modern, database-driven web application for managing vehicle detection system installations and mobility OS accounts. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

### Public Features
- **Landing Page**: Modern dark-themed interface with two registration options
- **Installation Registration**: Comprehensive form for vehicle detection system installations
- **Mobility OS Account Registration**: Simple account creation for end users
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Admin Features
- **Admin Authentication**: Secure login system for administrators
- **Installation Management**: View, edit, and mark installation registrations as complete
- **Mobility Account Management**: Manage mobility OS accounts and their status
- **Search & Filter**: Advanced filtering and search capabilities
- **Installation Calendar**: Calendar view for completed installations (drag-and-drop ready)
- **Real-time Statistics**: Dashboard with key metrics and statistics

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom admin authentication
- **Forms**: React Hook Form with validation
- **Icons**: Heroicons
- **Deployment**: Vercel (recommended)

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd vehicle-detection-registration
npm install
```

### 2. Set up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL commands from `database-schema.sql` to create the tables
4. Note your project URL and anon key

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourcompany.com
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

### Installations Table
- `id`: Unique identifier (UUID)
- `intersection_name`: Name of the intersection
- `end_user`: End user organization
- `distributor`: Distributor company
- `cabinet_type`: Type of cabinet (dropdown selection)
- `tls_connection`: TLS connection type (dropdown selection)
- `detection_io`: Detection I/O configuration (dropdown selection)
- `phasing_files`: Array of uploaded phasing files
- `timing_files`: Array of uploaded timing files
- `contact_name`: Contact person name
- `contact_email`: Contact email address
- `contact_phone`: Contact phone number
- `estimated_install_date`: Planned installation date
- `status`: Installation status (pending, completed, cancelled)
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

### Mobility Accounts Table
- `id`: Unique identifier (UUID)
- `first_name`: User's first name
- `last_name`: User's last name
- `email`: User's email address (unique)
- `phone`: User's phone number
- `end_user`: User's organization
- `status`: Account status (active, inactive)
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

## Form Fields

### Installation Registration Form
- **Intersection Information**: Name, End User, Distributor
- **Technical Specifications**: Cabinet Type, TLS Connection, Detection I/O
- **Document Upload**: Phasing files, Timing files (multiple file support)
- **Contact Information**: Name, Email, Phone
- **Installation Schedule**: Estimated install date (calendar picker)

### Mobility OS Account Form
- **Personal Information**: First Name, Last Name
- **Contact Details**: Email, Phone
- **Organization**: End User organization

## Admin Portal Features

### Dashboard
- Real-time statistics and metrics
- Quick overview of pending and completed installations
- Active mobility account counts

### Installation Management
- View all installation registrations
- Search and filter by various criteria
- Mark installations as completed or cancelled
- Edit installation details
- View contact information

### Mobility Account Management
- View all mobility OS accounts
- Search and filter accounts
- Activate/deactivate accounts
- Manage account status

### Installation Calendar
- Calendar view of completed installations
- Organized by estimated install date
- Drag-and-drop functionality (ready for implementation)
- Filter by end user

## Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourcompany.com
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_production_password
```

## Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for global styles
- Component-specific styles are in individual files

### Form Fields
- Add new fields in the respective form components
- Update database schema as needed
- Modify validation rules in form components

### Admin Features
- Extend admin dashboard with additional metrics
- Add more filtering options
- Implement additional management features

## Security Considerations

- Admin authentication is currently basic (consider implementing proper auth)
- File uploads are simulated (implement proper file storage)
- Add rate limiting for form submissions
- Implement proper input sanitization
- Consider adding CAPTCHA for public forms

## Future Enhancements

- [ ] Implement proper file upload to Supabase Storage
- [ ] Add email notifications for form submissions
- [ ] Implement drag-and-drop calendar functionality
- [ ] Add data export capabilities
- [ ] Implement proper user authentication system
- [ ] Add audit logging for admin actions
- [ ] Implement real-time updates with Supabase subscriptions
- [ ] Add mobile app support
- [ ] Implement advanced reporting features

## Support

For technical support or questions about this application, please contact your development team or create an issue in the project repository.

## License

This project is proprietary software. All rights reserved.
