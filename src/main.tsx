
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios'

// Set default axios base URL if needed
const backendUrl = import.meta.env.VITE_BACKEND_URL
if (backendUrl) {
  axios.defaults.baseURL = backendUrl
}

createRoot(document.getElementById("root")!).render(<App />);
