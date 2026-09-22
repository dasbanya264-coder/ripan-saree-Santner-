import React, { useState } from 'react';
import { Download, Smartphone, Check, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'banner' | 'card' | 'mobile';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = 'navbar',
  className = '' 
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already installed in standalone mode
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {/* Variant Rendering */}
      {variant === 'navbar' && (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
          title="Install R.D Textile App"
        >
          <Download className="w-3.5 h-3.5 text-stone-950 animate-bounce" />
          <span className="hidden sm:inline">Download App</span>
          <span className="sm:hidden">App</span>
        </button>
      )}

      {variant === 'mobile' && (
        <button
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-stone-900 text-amber-400 font-medium text-sm border border-amber-500/30 shadow-md transition-all hover:bg-stone-800 ${className}`}
        >
          <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-400/40 shrink-0">
            <img src="./logo.png" alt="RD" className="w-full h-full object-cover" />
          </div>
          <span>Install R.D Textile App</span>
          <Download className="w-4 h-4 ml-auto text-amber-400" />
        </button>
      )}

      {variant === 'banner' && (
        <div className={`bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-stone-100 p-3 sm:p-4 rounded-2xl border border-amber-500/30 shadow-lg flex items-center justify-between gap-4 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500/60 shadow-md shrink-0 bg-stone-950">
              <img src="./logo.png" alt="R.D Textile Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm sm:text-base text-amber-400 leading-tight">
                R.D TEXTILE App
              </div>
              <p className="text-xs text-stone-300 line-clamp-1">
                Install on your phone for fast & offline shopping experience
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Install</span>
          </button>
        </div>
      )}

      {/* Guide Modal for browsers where beforeinstallprompt didn't trigger directly (e.g. iOS Safari, Firefox, or Desktop) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-stone-900 border border-amber-500/40 p-6 text-stone-100 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full bg-stone-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Circular RD Logo Header */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 shadow-xl mb-3">
                <img
                  src="./logo.png"
                  alt="R.D Textile Circular Logo"
                  className="w-full h-full object-cover rounded-full bg-stone-950"
                />
              </div>
              <h3 className="font-serif font-bold text-xl text-amber-400">
                R.D TEXTILE
              </h3>
              <p className="text-xs text-stone-400 uppercase tracking-widest mt-0.5">
                Ripan Saree Center App
              </p>
            </div>

            {/* Instructions based on device */}
            <div className="mt-5 space-y-3 bg-stone-950/70 p-4 rounded-xl border border-stone-800 text-sm">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-200">1. Tap the Share button</p>
                      <p className="text-xs text-stone-400">Located at the bottom of Safari.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                      <PlusSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-200">2. Tap "Add to Home Screen"</p>
                      <p className="text-xs text-stone-400">Scroll down the share sheet and select "Add to Home Screen".</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-200">Install via Browser Menu</p>
                      <p className="text-xs text-stone-400">
                        Tap the three dots (⋮) in your browser top right corner and tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              {isInstallable && (
                <button
                  onClick={async () => {
                    await install();
                    setShowModal(false);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-md transition-transform active:scale-95 text-center flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Install Now
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className={`py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-medium transition-colors text-center ${isInstallable ? '' : 'w-full'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success notification */}
      {installSuccess && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom">
          <Check className="w-5 h-5" />
          <span className="text-sm font-medium">App installed successfully! Look for the R.D Textile icon on your home screen.</span>
        </div>
      )}
    </>
  );
};
