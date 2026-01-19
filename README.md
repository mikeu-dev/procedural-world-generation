# Procedural World Generation

A high-performance procedural terrain generation engine built with modern web technologies. This project demonstrates real-time terrain generation using noise algorithms, featuring infinite world exploration and dynamic level of detail.

## Features

- **Procedural Terrain**: Deterministic landscape generation powered by Simplex Noise.
- **Planetary Biomes**: Dynamic biome generation creating unique "planets" with distinct color palettes and terrain rules for every seed.
- **Infinite World**: Seamless chunk loading system for endless exploration.
- **Interactive Camera**: Smooth navigation controls (WASD/Arrows) with zoom capabilities.
- **Real-time Rendering**: Optimized HTML5 Canvas rendering pipeline.
- **Customizable Seeds**: Seed-based generation for reproducible worlds, with a quick "Change World" feature to instantly explore new variations.

## Technology Stack

- **Framework**: [Svelte](https://svelte.dev)
- **Build System**: [Vite](https://vitejs.dev)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Core Algorithms**: [Simplex Noise](https://github.com/jwagner/simplex-noise.js)

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm

### Installation

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

## Building for Production

To build the application for production:

```bash
npm run build
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

Copyright © 2026 mikeu-dev. All rights reserved.
Licensed under the [MIT License](LICENSE).
