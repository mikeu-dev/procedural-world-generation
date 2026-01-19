import { Chunk, CHUNK_SIZE } from './Chunk';
import { NoiseGenerator } from './Noise';
import { BiomeGenerator } from './Biome';

/**
 * Manages the infinite game world.
 * Handles chunk loading, generation, and storage.
 */
export class World {
    /** Map of loaded chunks, keyed by coordinate string "x,y". */
    private chunks: Map<string, Chunk> = new Map();
    /** The noise generator used for the entire world. */
    private noise: NoiseGenerator;
    /** The biome generator for this world. */
    public biomeGenerator: BiomeGenerator;
    /** The seed used for the world. */
    private seed: string;

    /**
     * Creates a new World instance.
     * @param seed - The world generation seed.
     */
    constructor(seed: string) {
        this.seed = seed;
        this.noise = new NoiseGenerator(seed);
        this.biomeGenerator = new BiomeGenerator(seed);
    }

    /**
     * Retrieves a chunk at the specified chunk coordinates.
     * If the chunk does not exist, it is generated.
     * 
     * @param chunkX - The chunk's X coordinate.
     * @param chunkY - The chunk's Y coordinate.
     * @returns The requested Chunk.
     */
    public getChunk(chunkX: number, chunkY: number): Chunk {
        const key = `${chunkX},${chunkY}`;
        if (!this.chunks.has(key)) {
            const chunk = new Chunk(chunkX, chunkY, this.noise, this.biomeGenerator);
            this.chunks.set(key, chunk);
        }
        return this.chunks.get(key)!;
    }

    /**
     * Updates the world state based on player position.
     * Currently a placeholder for chunk unloading logic.
     * 
     * @param playerX - Player's world X coordinate.
     * @param playerY - Player's world Y coordinate.
     * @param renderDistance - Radius of chunks to keep loaded.
     */
    public update(playerX: number, playerY: number, renderDistance: number) {
        // Unload far chunks logic could go here
    }

    /**
     * Gets all chunks associated with a specific world-space rectangle.
     * Useful for rendering the visible area of the world.
     * 
     * @param x - World X coordinate of the rectangle.
     * @param y - World Y coordinate of the rectangle.
     * @param width - Width of the rectangle.
     * @param height - Height of the rectangle.
     * @returns An array of visible Chunks.
     */
    public getChunksInRect(x: number, y: number, width: number, height: number): Chunk[] {
        const startChunkX = Math.floor(x / CHUNK_SIZE);
        const startChunkY = Math.floor(y / CHUNK_SIZE);
        const endChunkX = Math.floor((x + width) / CHUNK_SIZE);
        const endChunkY = Math.floor((y + height) / CHUNK_SIZE);

        const chunks: Chunk[] = [];
        for (let cy = startChunkY; cy <= endChunkY; cy++) {
            for (let cx = startChunkX; cx <= endChunkX; cx++) {
                chunks.push(this.getChunk(cx, cy));
            }
        }
        return chunks;
    }
}
