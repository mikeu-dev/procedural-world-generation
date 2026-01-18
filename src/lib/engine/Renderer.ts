import type { World } from './World';
import { CHUNK_SIZE } from './Chunk';
import { BIOMES } from './Biome';

export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private width: number = 0;
    private height: number = 0;

    // Config
    private scale: number = 4;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) {
            throw new Error('Could not get 2D context');
        }
        this.ctx = context;
        this.resize();

        window.addEventListener('resize', () => this.resize());
    }

    public resize(): void {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx.imageSmoothingEnabled = false;
    }

    public setScale(newScale: number): void {
        this.scale = Math.max(1, Math.min(32, newScale));
    }

    public getScale(): number {
        return this.scale;
    }

    public clear(): void {
        this.ctx.fillStyle = '#0d0d0d';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    public render(world: World, cameraX: number, cameraY: number): void {
        this.clear();

        const tilesInScreenX = Math.ceil(this.width / this.scale);
        const tilesInScreenY = Math.ceil(this.height / this.scale);

        const chunks = world.getChunksInRect(cameraX, cameraY, tilesInScreenX, tilesInScreenY);

        for (const chunk of chunks) {
            this.renderChunk(chunk, cameraX, cameraY);
        }

        // Debug Info
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`Chunks: ${chunks.length}`, 10, 20);
        this.ctx.fillText(`Cam: ${cameraX.toFixed(1)}, ${cameraY.toFixed(1)}`, 10, 35);
        this.ctx.fillText(`Zoom: ${this.scale.toFixed(1)}`, 10, 50);
    }

    private renderChunk(chunk: any, camX: number, camY: number) {
        const startX = chunk.x * CHUNK_SIZE;
        const startY = chunk.y * CHUNK_SIZE;

        const screenOffsetX = (startX - camX) * this.scale;
        const screenOffsetY = (startY - camY) * this.scale;

        if (screenOffsetX > this.width || screenOffsetY > this.height ||
            screenOffsetX + CHUNK_SIZE * this.scale < 0 || screenOffsetY + CHUNK_SIZE * this.scale < 0) {
            return;
        }

        for (let dy = 0; dy < CHUNK_SIZE; dy++) {
            for (let dx = 0; dx < CHUNK_SIZE; dx++) {
                const index = dy * CHUNK_SIZE + dx;

                // Draw Tile
                const biomeIndex = chunk.tiles[index];
                const biome = BIOMES[biomeIndex];

                const px = Math.floor(screenOffsetX + dx * this.scale);
                const py = Math.floor(screenOffsetY + dy * this.scale);
                const pSize = Math.ceil(this.scale);

                if (biome) {
                    this.ctx.fillStyle = biome.color;
                    this.ctx.fillRect(px, py, pSize, pSize);
                }

                // Draw Object
                const obj = chunk.objects[index];
                if (obj > 0) {
                    this.ctx.fillStyle = obj === 1 ? '#064e3b' : '#3f3f46'; // Dark Green (Tree) or Dark Grey (Rock)
                    const padding = this.scale * 0.25;
                    this.ctx.fillRect(
                        px + padding,
                        py + padding,
                        pSize - padding * 2,
                        pSize - padding * 2
                    );
                }
            }
        }
    }

    public destroy(): void {
        window.removeEventListener('resize', () => this.resize());
    }
}
