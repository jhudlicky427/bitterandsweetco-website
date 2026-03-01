# Admin Panel Setup Guide

## Accessing the Admin Panel

Once you've set up your admin account (see below), an "Admin" button will automatically appear in the navigation bar. Simply click this button to access the admin panel.

The admin button only appears for users with admin privileges, keeping it hidden from regular customers.

## Creating Your First Admin User

Since this is a fresh setup, you'll need to create your first admin account and grant it admin privileges.

### Important: Disable Email Confirmation (Recommended for Testing)

For easier testing and development, disable email confirmation in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Settings
3. Scroll to "Email Auth"
4. Uncheck "Enable email confirmations"
5. Click "Save"

This allows users to sign up and log in immediately without needing to confirm their email address.

### Step 1: Create an Account

You have two options to create your admin account:

**Option A: Through Supabase Dashboard (Recommended)**
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Enter your email and password
5. Make sure "Auto Confirm User" is checked
6. Click "Create User"

**Option B: Through the Website Sign-Up Form**
1. Go to your website
2. Click "Login" in the navigation
3. Switch to the "Sign Up" tab
4. Enter your email and password
5. Click "Create Account"
6. If email confirmation is enabled, check your email for a confirmation link

### Step 2: Grant Admin Role

After creating your user account, you need to update the database to give yourself admin privileges:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run this query (replace `your-email@example.com` with your actual email):

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### Step 3: Sign In

1. Go to your website and click "Login" in the navigation
2. Sign in with the email and password you created
3. Once logged in, you'll see an "Admin" button appear in the navigation bar
4. Click the "Admin" button to access your admin dashboard!

## Admin Features

Your admin panel includes:

- **Menu Management**: Add, edit, and delete menu items
- **Locations Management**: Manage your trailer locations and schedules
- **Event Bookings**: View all event booking requests from customers
- **Contact Forms**: View all contact form submissions (kept private from public)

## Security Notes

- Contact form submissions are write-only for the public and can only be viewed by admins
- Only admin users can modify menu items, locations, and view bookings
- Regular users cannot access the admin panel
- All database operations are protected by Row Level Security (RLS) policies
