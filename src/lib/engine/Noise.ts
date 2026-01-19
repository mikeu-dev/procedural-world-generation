import { createNoise2D } from 'simplex-noise';
import type { NoiseFunction2D } from 'simplex-noise';

/**
 * Handles procedural noise generation using Simplex Noise.
 * Supports standard 2D noise and Fractal Brownian Motion (FBM).
 */
export class NoiseGenerator {
    private noise2D: NoiseFunction2D;
    private seed: string;

    /**
     * Creates a new NoiseGenerator instance.
     * @param seed - The seed string for random generation. Defaults to a random string.
     */
    constructor(seed: string = Math.random().toString()) {
        this.seed = seed;
        // Simple hash-based seeding for simplex-noise (it uses Math.random fallback if not provided custom PRNG, 
        // but for now we'll just instantiate. 
        // Note: simplex-noise 4.x accepts a PRNG function. We can implement a simple Alea or similar if needed for strict determinism,
        // but for this prototype, we'll assume the factory handles basic seeding or we'll wrap a seeded random.)

        // For true determinism we need a seeded PRNG. 
        // Let's use a simple LCG or just a hash of the seed to drive the noise creation if possible, 
        // but simplex-noise 4.x creates a random permutation table if no PRNG is passed.
        // We will pass a simple seeded PRNG.
        this.noise2D = createNoise2D(this.createSeededRandom(seed));
    }

    /**
     * Creates a simple seeded pseudo-random number generator.
     * @param seed - The seed string.
     * @returns A function that returns a number between 0 and 1.
     */
    private createSeededRandom(seed: string): () => number {
        // Simple hash function to generate a numeric seed
        let h = 0xdeadbeef;
        for (let i = 0; i < seed.length; i++) {
            h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
        }

        // Simple SplitMix32-like PRNG
        return () => {
            h = Math.imul(h ^ (h >>> 16), 2246822507);
            h = Math.imul(h ^ (h >>> 13), 3266489909);
            return ((h ^= h >>> 16) >>> 0) / 4294967296;
        };
    }

    /**
     * Gets a raw noise value at the specified coordinates.
     * @param x - The x-coordinate.
     * @param y - The y-coordinate.
     * @returns A noise value between -1 and 1.
     */
    public get(x: number, y: number): number {
        return this.noise2D(x, y);
    }

    /**
     * Generates Fractal Brownian Motion (FBM) noise.
     * FBM combines multiple layers (octaves) of noise for more detail.
     * 
     * @param x - The x-coordinate.
     * @param y - The y-coordinate.
     * @param octaves - Number of layers of noise to combine. (Default: 4)
     * @param lacunarity - Frequency multiplier per octave. (Default: 2.0)
     * @param gain - Amplitude multiplier per octave (persistence). (Default: 0.5)
     * @returns A normalized noise value approximately between -1 and 1.
     */
    public getFBM(x: number, y: number, octaves: number = 4, lacunarity: number = 2.0, gain: number = 0.5): number {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;  // Used for normalizing result to 0.0 - 1.0

        for (let i = 0; i < octaves; i++) {
            total += this.noise2D(x * frequency, y * frequency) * amplitude;

            maxValue += amplitude;

            amplitude *= gain;
            frequency *= lacunarity;
        }

        return total / maxValue; // Normalize to -1..1 range roughly (actually it's weighted average)
    }
}
