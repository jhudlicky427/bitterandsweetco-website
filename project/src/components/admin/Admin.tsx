import { useAuth } from '../../contexts/AuthContext';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-200 text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-amber-50">Access Denied</h2>
          <p className="text-amber-200/80">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}
