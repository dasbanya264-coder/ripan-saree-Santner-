import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, Heart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useStoreSettings } from '../../hooks/useStoreSettings';
import { useState } from 'react';
import { PWAInstallButton } from '../common/PWAInstallButton';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { settings } = useStoreSettings();

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-stone-900 text-stone-100 py-1.5 px-4 text-center text-xs font-sans tracking-widest uppercase relative z-50 flex items-center justify-center gap-2">
        <span>Free Shipping on orders above ₹2000 | Authentic Handloom Sarees</span>
      </div>
      <nav className="bg-white/95 backdrop-blur-xl border-b border-stone-200 sticky w-full z-50 top-0 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-stone-600 hover:text-amber-600 transition-colors p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 md:w-13 md:h-13 rounded-full overflow-hidden border-2 border-amber-500/60 shadow-md bg-stone-950 shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img 
                  src={settings?.logoUrl || "./logo.png"} 
                  alt="R.D TEXTILE Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-serif font-bold text-xl">
                  RD
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-xl md:text-2xl tracking-wide text-stone-900 leading-tight">
                  R.D TEXTILE
                </span>
                <span className="text-[10px] uppercase tracking-widest text-amber-700 font-bold leading-tight">
                  Ripan Saree Center
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 ml-8">
              <Link to="/" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors tracking-wide uppercase">Home</Link>
              <Link to="/shop" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors tracking-wide uppercase">Shop All</Link>
              <Link to="/shop?category=silk" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors tracking-wide uppercase">Silk</Link>
              <Link to="/shop?category=wedding" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors tracking-wide uppercase">Wedding</Link>
            </div>

            <div className="flex-1"></div>

            {/* Icons & Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Install / Download App Button */}
              <PWAInstallButton variant="navbar" />

              <div className="hidden md:flex relative group mr-1">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as typeof e.target & { search: { value: string } };
                  if (target.search.value.trim()) navigate(`/shop?search=${encodeURIComponent(target.search.value.trim())}`);
                }}>
                  <input
                    type="text"
                    name="search"
                    placeholder="Search sarees..."
                    className="w-40 lg:w-48 pl-9 pr-3 py-1.5 rounded-full border border-stone-200 bg-stone-50 focus:outline-none focus:border-amber-400 focus:bg-white focus:w-60 transition-all duration-300 text-sm"
                  />
                </form>
                <Search className="absolute left-3 top-2 w-4 h-4 text-stone-400 group-focus-within:text-amber-500" />
              </div>

              <button 
                onClick={() => navigate('/shop')} 
                className="md:hidden text-stone-600 hover:text-amber-600 transition-colors p-2"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <Link to="/wishlist" className="text-stone-600 hover:text-amber-600 transition-colors hidden sm:block p-2" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
              </Link>
              
              <Link to="/cart" className="text-stone-600 hover:text-amber-600 transition-colors relative p-2 group" aria-label="Cart">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              <button 
                onClick={() => user ? navigate('/profile') : navigate('/login')}
                className="text-stone-600 hover:text-amber-600 transition-colors p-2"
                aria-label="User Account"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-100 bg-white absolute w-full pb-6 shadow-xl animate-in slide-in-from-top-2">
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Install App Button */}
              <div className="mb-3">
                <PWAInstallButton variant="mobile" />
              </div>

              <Link onClick={() => setIsMobileMenuOpen(false)} to="/" className="block px-4 py-3 rounded-lg text-sm font-medium text-stone-800 hover:text-amber-600 hover:bg-amber-50 tracking-wide uppercase transition-colors">Home</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/shop" className="block px-4 py-3 rounded-lg text-sm font-medium text-stone-800 hover:text-amber-600 hover:bg-amber-50 tracking-wide uppercase transition-colors">Shop All</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/shop?category=silk" className="block px-4 py-3 rounded-lg text-sm font-medium text-stone-800 hover:text-amber-600 hover:bg-amber-50 tracking-wide uppercase transition-colors">Silk Collection</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/shop?category=wedding" className="block px-4 py-3 rounded-lg text-sm font-medium text-stone-800 hover:text-amber-600 hover:bg-amber-50 tracking-wide uppercase transition-colors">Wedding Special</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} to="/wishlist" className="block px-4 py-3 rounded-lg text-sm font-medium text-stone-800 hover:text-amber-600 hover:bg-amber-50 tracking-wide uppercase transition-colors">My Wishlist</Link>
              <div className="h-px bg-stone-100 my-2"></div>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); user ? navigate('/profile') : navigate('/login'); }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 tracking-wide uppercase transition-colors"
              >
                {user ? 'My Profile / Orders' : 'Login / Register'}
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}