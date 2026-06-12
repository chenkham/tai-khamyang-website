import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';
import App from './App.tsx';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

createRoot(document.getElementById('root')!).render(<App />);
