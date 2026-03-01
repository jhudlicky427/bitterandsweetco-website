# Bitter & Sweet Co. - Mobile Lemonade Trailer

A modern, full-featured web application for Bitter & Sweet Co., a mobile lemonade and beverage trailer serving the Denver Metro Area.

## Features

- **Interactive Menu** - Browse handcrafted lemonades, teas, and dirty sodas
- **Drink Customization** - Fully customize your drinks with size, sweetness, ice level, syrups, and add-ins
- **Shopping Cart** - Add items to cart and manage orders
- **User Authentication** - Secure login and user profiles with Supabase Auth
- **Favorites System** - Save your custom drink combinations for quick reordering
- **Order History** - View past orders and reorder with one click
- **Location Tracking** - Find where the trailer will be next
- **Event Calendar** - Book the trailer for events and parties
- **AI Chatbot** - Get instant answers about menu, locations, and bookings
- **Admin Panel** - Manage menu items, locations, customization options, and view bookings

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL database, Auth, Real-time)
- **Deployment**: Ready for Vercel, Netlify, or similar platforms

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd bitter-sweet-co
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:
- Go to your Supabase project dashboard
- Navigate to SQL Editor
- Run the migration files in order from `supabase/migrations/`

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Project Structure

```
bitter-sweet-co/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin panel components
│   │   ├── Cart.tsx
│   │   ├── ChatBot.tsx
│   │   ├── Contact.tsx
│   │   ├── DrinkCustomizer.tsx
│   │   ├── EventCalendar.tsx
│   │   ├── Home.tsx
│   │   ├── Locations.tsx
│   │   ├── Login.tsx
│   │   ├── Menu.tsx
│   │   ├── Navigation.tsx
│   │   └── Story.tsx
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── lib/               # Utilities and config
│   │   └── supabase.ts
│   ├── services/          # Business logic
│   │   └── chatbotService.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   ├── functions/         # Edge functions
│   └── migrations/        # Database migrations
├── public/               # Static assets
└── package.json
```

## Database Schema

The application uses Supabase with the following main tables:

- `menu_items` - Menu items and beverages
- `customization_options` - Drink customization options
- `create_your_own_bases` - Base options for create-your-own drinks
- `locations` - Trailer locations and schedules
- `event_bookings` - Event booking requests
- `contact_submissions` - Contact form submissions
- `user_profiles` - User profile data with role-based access
- `orders` - Customer orders
- `order_items` - Individual items in orders
- `favorites` - Saved drink customizations

## Admin Setup

See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for detailed instructions on setting up admin access.

Quick steps:
1. Create a user account via sign-up
2. Update user role to 'admin' in database
3. Sign in to access admin panel

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify

1. Push your code to GitHub
2. Connect repository in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy

## Security

- Row Level Security (RLS) enabled on all tables
- Authentication required for cart and orders
- Admin-only access for management features
- Secure API keys via environment variables

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.

## Contact

Bitter & Sweet Co.
- Email: info@bitterandsweetco.com
- Phone: (720) 735-2700
- Location: Denver Metro Area, Colorado

## Acknowledgments

- Design inspiration from modern food service websites
- Icons by Lucide React
- Built with React and Supabase
