
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import axios from 'axios'

// Set default axios base URL for frontend
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
axios.defaults.baseURL = backendUrl

createRoot(document.getElementById("root")!).render(<App />);
