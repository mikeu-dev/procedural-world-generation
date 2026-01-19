import type { NoiseGenerator } from './Noise';
import { getBiome, BIOMES } from './Biome';

/**
 * The width and height of a chunk in tiles.
 * Chunks are square.
 */
export const CHUNK_SIZE = 32;

/**
 * Represents a specific area of the game world.
 * Contains tile data and objects for that area.
 */
export class Chunk {
    /** The chunk's X coordinate (not world coordinate). */
    public x: number;
    /** The chunk's Y coordinate (not world coordinate). */
    public y: number;
    /** 
     * Flat array of tile data. 
     * Each value corresponds to an index in the BIOMES array.
     */
    public tiles: Uint8Array;
    /** 
     * Flat array of object data.
     * 0 = None, 1 = Tree, 2 = Rock.
     */
    public objects: Uint8Array;
    /** Debug color for visualizing chunk boundaries. */
    public debugColor: string;

    /**
     * Creates and generates a new Chunk.
     * @param x - The chunk's X coordinate.
     * @param y - The chunk's Y coordinate.
     * @param noise - The noise generator instance to use for terrain generation.
     */
    constructor(x: number, y: number, noise: NoiseGenerator) {
        this.x = x;
        this.y = y;
        this.tiles = new Uint8Array(CHUNK_SIZE * CHUNK_SIZE);
        this.objects = new Uint8Array(CHUNK_SIZE * CHUNK_SIZE);
        this.debugColor = `hsl(${Math.random() * 360}, 50%, 50%)`;

        this.generate(noise);
    }

    /**
     * Generates the terrain and objects for this chunk using the noise generator.
     * Populates `tiles` and `objects` arrays.
     * @param noise - The noise generator.
     */
    private generate(noise: NoiseGenerator) {
        for (let dy = 0; dy < CHUNK_SIZE; dy++) {
            for (let dx = 0; dx < CHUNK_SIZE; dx++) {
                const worldX = this.x * CHUNK_SIZE + dx;
                const worldY = this.y * CHUNK_SIZE + dy;

                const elevation = noise.getFBM(worldX * 0.01, worldY * 0.01, 4, 2, 0.5);
                const moisture = noise.getFBM(worldX * 0.02 + 1000, worldY * 0.02 + 1000, 2);

                const biome = getBiome(elevation, moisture);
                const biomeIndex = BIOMES.indexOf(biome);

                const index = dy * CHUNK_SIZE + dx;
                this.tiles[index] = biomeIndex !== -1 ? biomeIndex : 0;

                // Object Placement
                const objectNoise = noise.get(worldX * 0.5, worldY * 0.5);

                if (biome.name === 'Forest' && objectNoise > 0.2) {
                    this.objects[index] = 1; // Tree
                } else if (biome.name === 'Mountain' && objectNoise > 0.5) {
                    this.objects[index] = 2; // Rock
                } else if (biome.name === 'Grass' && objectNoise > 0.7) {
                    this.objects[index] = Math.random() > 0.5 ? 1 : 2;
                }
            }
        }
    }
}
