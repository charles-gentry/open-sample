# Open Sample

A web application for planning statistically robust environmental sampling locations and navigating to them in the field.

## The Problem

Environmental researchers and field scientists need to generate sampling locations that follow rigorous spatial strategies — random, grid, clustered, or transect-based patterns — and then physically navigate to those exact coordinates with a mobile device. Open Sample combines both workflows into a single tool: a desktop planning interface for designing sample plans and a mobile navigation interface for fieldwork.

## Who It's For

- Environmental scientists conducting field studies
- Ecology researchers requiring spatial sampling strategies
- Conservation specialists planning survey locations
- Land management professionals collecting field data

## Features

- **Four sampling algorithms** — Random (Poisson disk), Grid, Clustered, and W Pattern (transect)
- **Interactive map** — Draw a study area polygon or upload a KML file
- **Configurable parameters** — Point count, minimum distance between points, cluster count and spacing
- **Weather & satellite forecasts** — 14-day weather outlook and Sentinel satellite pass times for the study area
- **Plan sharing** — Generate a compressed URL or QR code to send plans to field teams
- **Mobile compass navigation** — Real-time GPS tracking with a compass arrow pointing to the next sampling point
- **Progress tracking** — Mark points complete, auto-advance to the nearest uncompleted point, and view a mini map of all points

## Installation

**Prerequisites:** Node.js and npm

```bash
# Clone the repository
git clone https://github.com/charles-gentry/open-sample.git
cd open-sample

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

Open Sample has two main workflows:

### Planning (Desktop)

1. Open the app and click **Start Planning**
2. Draw a polygon on the map to define your study area, or upload a KML file
3. Configure sampling parameters — plan name, number of points (1–99), sampling type, and minimum distance
4. Click **Generate Points** to create sample locations
5. Review the 14-day weather forecast and satellite pass schedule
6. Click **Share Plan** to generate a URL and QR code for your field team

### Navigation (Mobile)

1. Open the shared link on a mobile device
2. Grant GPS and compass permissions when prompted
3. Follow the compass arrow toward the current target point
4. When within 5 meters, tap **Mark Complete**
5. The app automatically selects the nearest uncompleted point
6. Repeat until all points are visited

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview the production build locally |

## Tech Stack

- **React** with **TypeScript** — UI framework
- **Vite** — Build tool and dev server
- **MapLibre GL** + **React Map GL** — Interactive mapping
- **Turf.js** — Geospatial analysis (distance, bearing, point-in-polygon)
- **Zustand** — Lightweight state management
- **Tailwind CSS** — Utility-first styling
- **Satellite.js** — Satellite pass predictions
- **Pako** — Compression for URL encoding
- Deployed on **Vercel**

## Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Install dependencies (`npm install`)
4. Make your changes
5. Run the linter (`npm run lint`) and fix any issues
6. Ensure the project builds (`npm run build`)
7. Commit your changes and open a pull request
