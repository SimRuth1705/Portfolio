# SAMSON RAJ | Full Stack Developer

A high-performance, minimalist portfolio built to showcase scalable digital architectures and modern web design aesthetics.

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Deployment](#deployment)

## Overview

This repository contains my personal portfolio website, featuring a dynamic UI with smooth scrolling, parallax effects, and custom animations. The layout is designed with a premium, enterprise-grade look and feel.

## Tech Stack

- **Frontend Framework**: React (via Vite)
- **Styling**: Tailwind CSS, PostCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Installation

To run this project locally:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd samson-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to view it in the browser.

## Deployment

Since the app uses React Router for client-side routing, you need a host that supports Single Page Application (SPA) redirects to avoid 404 errors on direct navigation.

**Recommended Hosts:**
- **Vercel** or **Netlify**: Highly recommended. They auto-detect the Vite configuration and handle SPA routing seamlessly.
- **GitHub Pages**: Requires setting up a custom `404.html` or hash routing hack. For best results with `react-router-dom`, use Vercel.

**Build for output:**
```bash
npm run build
```
The optimized files will be generated in the `dist` footprint.
