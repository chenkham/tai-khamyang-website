# Tai Hub Project Details

## Project Overview
Tai Hub is a premium web application designed to showcase Tai Khamyang culture, dictionaries, and 3D animated assets. It is built to be "buttery smooth" utilizing the latest web technologies including React, Vite, Tailwind CSS, GSAP for animations, Lenis for smooth scrolling, and React Three Fiber for 3D model rendering.

## Tech Stack
- **Frontend Framework:** React 18, Vite
- **Styling:** Tailwind CSS, PostCSS
- **Animations:** GSAP (ScrollTrigger), Framer Motion
- **3D Rendering:** Three.js, React Three Fiber (@react-three/fiber), Drei (@react-three/drei)
- **Smooth Scrolling:** @studio-freight/lenis
- **Routing:** React Router v7
- **Authentication & Database:** Appwrite (OAuth, Email, DB)

## Features
- Interactive 3D Khamyang Character animations directly embedded in the DOM.
- GSAP-powered ScrollTriggers for immersive, buttery-smooth parallax scrolling.
- Global Light and Dark mode theme toggling.
- Google OAuth and Email Authentication flow (Appwrite).
- Profile page with "Saved Words" functionality using Appwrite Database.

## Hosting Requirements
- The app should be built using `npm run build`.
- The `dist` folder should be uploaded or hosted using a static site provider or Appwrite's built-in hosting.
- Set up Appwrite Project ID and Endpoint in environment variables.
