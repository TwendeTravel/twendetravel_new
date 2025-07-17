import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Dynamically register service worker in production
if (import.meta.env.PROD) {
  // Unregister any existing service workers to ensure fresh assets
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => registrations.forEach(reg => reg.unregister()))
      .catch(err => console.error('Service worker unregister failed:', err));
  }
  import('virtual:pwa-register')
    .then(({ registerSW }) => {
      const updateSW = registerSW({
        onOfflineReady() {
          console.log('App is ready to work offline');
        },
        onNeedRefresh() {
          if (confirm('New content available. Refresh to update?')) {
            updateSW();
          }
        }
      });
    })
    .catch(() => {
      // PWA plugin not initialized
    });
}

createRoot(document.getElementById("root")!).render(<App />);
