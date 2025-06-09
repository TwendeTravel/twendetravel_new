import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register';

createRoot(document.getElementById("root")!).render(<App />);

// Register PWA service worker
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
