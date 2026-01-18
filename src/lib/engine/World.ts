import { Chunk, CHUNK_SIZE } from './Chunk';
import { NoiseGenerator } from './Noise';

export class World {
    private chunks: Map<string, Chunk> = new Map();
    private noise: NoiseGenerator;
    private seed: string;

    constructor(seed: string) {
        this.seed = seed;
        this.noise = new NoiseGenerator(seed);
    }

    public getChunk(chunkX: number, chunkY: number): Chunk {
        const key = `${chunkX},${chunkY}`;
        if (!this.chunks.has(key)) {
            const chunk = new Chunk(chunkX, chunkY, this.noise);
            this.chunks.set(key, chunk);
        }
        return this.chunks.get(key)!;
    }

    public update(playerX: number, playerY: number, renderDistance: number) {
        // Unload far chunks logic could go here
    }

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
