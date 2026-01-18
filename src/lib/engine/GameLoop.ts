export type UpdateCallback = (deltaTime: number) => void;
export type RenderCallback = () => void;

export class GameLoop {
    private lastTime: number = 0;
    private animationFrameId: number | null = null;
    private onUpdate: UpdateCallback;
    private onRender: RenderCallback;
    private isRunning: boolean = false;

    constructor(onUpdate: UpdateCallback, onRender: RenderCallback) {
        this.onUpdate = onUpdate;
        this.onRender = onRender;
    }

    public start(): void {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    public stop(): void {
        this.isRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    private loop = (time: number): void => {
        if (!this.isRunning) return;

        const deltaTime = (time - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = time;

        this.onUpdate(deltaTime);
        this.onRender();

        this.animationFrameId = requestAnimationFrame(this.loop);
    };
}
