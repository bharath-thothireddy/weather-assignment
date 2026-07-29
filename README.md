# Weather Intelligence App

A modern, frosted glass weather application with 7-day forecasting, interactive charts, 3D globe, and smart insights, built using React, Vite, and Tailwind CSS.

## 1. AI Studio Prompt Setup & Direct GitHub Connection Steps

You can build or modify this application directly in Google AI Studio using prompts.

1. Open Google AI Studio and start a new project.
2. Provide a prompt such as: "Build a modern Weather Intelligence App using React, Vite, and Tailwind CSS. Use the Open-Meteo API for weather data and apply a frosted glass immersive UI design."
3. Once the applet is built, click on the **Settings** or menu options in the AI Studio UI.
4. Select **Export to GitHub** to link your GitHub account and directly push the repository to your GitHub.

## 2. Local Development

To run this project locally on your machine, follow these steps:

```bash
# Clone the repository (if you exported it to GitHub)
git clone <your-repository-url>
cd <your-repository-name>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000` (or the port specified by Vite).

## 3. Production Build

To build the application for production, run:

```bash
# Build the project
npm run build
```

This will compile the TypeScript and React code and output the static files into the `dist/` directory, which is ready for deployment.

## 4. Cloudflare Pages Deployment Guide

You can easily deploy this SPA (Single Page Application) to Cloudflare Pages.

### Prerequisites:
- A GitHub account with this repository.
- A Cloudflare account.

### Step-by-Step Deployment:
1. Log in to your Cloudflare dashboard and go to **Workers & Pages**.
2. Click **Create application** and go to the **Pages** tab.
3. Click **Connect to Git** and select this repository from your GitHub account.
4. Click **Begin setup**.
5. Configure the Build settings:
   - **Framework preset**: None (or select Vite if available)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Click **Save and Deploy**.

### SPA Route Handling
Since this is a React SPA, you might need to handle client-side routing.
Create a `public/_redirects` file (or just `_redirects` in your `public/` directory before building) with the following content to ensure all routes fallback to `index.html`:
```
/* /index.html 200
```

### Open-Meteo API Reference
This application uses the free, open-source Open-Meteo API. No API key is required.
- **Geocoding API**: Used to search for cities and get latitude/longitude.
  `https://geocoding-api.open-meteo.com/v1/search`
- **Weather Forecast API**: Used to fetch current weather and 7-day forecasts.
  `https://api.open-meteo.com/v1/forecast`

For more details, visit [Open-Meteo Documentation](https://open-meteo.com/).
