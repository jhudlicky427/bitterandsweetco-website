import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Menu from './components/Menu';
import Locations from './components/Locations';
import Story from './components/Story';
import Contact from './components/Contact';
import Cart from './components/Cart';
import Login from './components/Login';
import Admin from './components/admin/Admin';
import ChatBot from './components/ChatBot';

function App() {
  const [currentSection, setCurrentSection] = useState('home');

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return <Home onNavigate={setCurrentSection} />;
      case 'menu':
        return <Menu />;
      case 'locations':
        return <Locations />;
      case 'story':
        return <Story />;
      case 'contact':
        return <Contact />;
      case 'cart':
        return <Cart />;
      case 'login':
        return <Login onNavigate={setCurrentSection} />;
      case 'admin':
        return <Admin />;
      default:
        return <Home onNavigate={setCurrentSection} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen wood-background">
          {currentSection !== 'admin' && (
            <Navigation currentSection={currentSection} onNavigate={setCurrentSection} />
          )}
          <main>
            {renderSection()}
          </main>
          {currentSection !== 'admin' && <ChatBot />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
