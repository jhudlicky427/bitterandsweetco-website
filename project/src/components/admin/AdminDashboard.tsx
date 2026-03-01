import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Menu as MenuIcon, MapPin, Calendar, Mail, Settings } from 'lucide-react';
import AdminMenu from './AdminMenu';
import AdminLocations from './AdminLocations';
import AdminBookings from './AdminBookings';
import AdminContacts from './AdminContacts';
import AdminCustomization from './AdminCustomization';

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState('menu');
  const { signOut, profile } = useAuth();

  const tabs = [
    { id: 'menu', label: 'Menu Items', icon: MenuIcon },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'customization', label: 'Customization', icon: Settings },
    { id: 'bookings', label: 'Event Bookings', icon: Calendar },
    { id: 'contacts', label: 'Contact Forms', icon: Mail },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case 'menu':
        return <AdminMenu />;
      case 'locations':
        return <AdminLocations />;
      case 'customization':
        return <AdminCustomization />;
      case 'bookings':
        return <AdminBookings />;
      case 'contacts':
        return <AdminContacts />;
      default:
        return <AdminMenu />;
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-amber-950/60 backdrop-blur-sm border-b border-amber-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-amber-50">Bitter & Sweet Co. Admin</h1>
              <p className="text-amber-200/60 text-sm mt-1">Welcome, {profile?.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 bg-amber-900/40 hover:bg-amber-900/60 text-amber-200 rounded-lg transition-all"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-amber-950/40 backdrop-blur-sm rounded-lg border border-amber-800/30 overflow-hidden">
          <div className="border-b border-amber-800/30">
            <nav className="flex space-x-1 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      currentTab === tab.id
                        ? 'bg-amber-600 text-white'
                        : 'text-amber-200 hover:bg-amber-900/40'
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
