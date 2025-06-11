import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Dynamically register service worker in production
if (import.meta.env.PROD) {
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
