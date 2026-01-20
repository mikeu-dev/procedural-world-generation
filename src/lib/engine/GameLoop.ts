export type UpdateCallback = (deltaTime: number) => void;
export type RenderCallback = () => void;

/**
 * Manages the main game loop using requestAnimationFrame.
 * Provides a reliable loop with delta time calculation.
 */
export class GameLoop {
	private lastTime: number = 0;
	private animationFrameId: number | null = null;
	private onUpdate: UpdateCallback;
	private onRender: RenderCallback;
	private isRunning: boolean = false;

	/**
	 * Creates a new GameLoop instance.
	 * @param onUpdate - Callback function for game logic updates. Receives deltaTime in seconds.
	 * @param onRender - Callback function for rendering.
	 */
	constructor(onUpdate: UpdateCallback, onRender: RenderCallback) {
		this.onUpdate = onUpdate;
		this.onRender = onRender;
	}

	/**
	 * Starts the game loop if it is not already running.
	 */
	public start(): void {
		if (this.isRunning) return;
		this.isRunning = true;
		this.lastTime = performance.now();
		this.loop(this.lastTime);
	}

	/**
	 * Stops the game loop.
	 */
	public stop(): void {
		this.isRunning = false;
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	/**
	 * The internal loop function called by requestAnimationFrame.
	 * @param time - The current time provided by requestAnimationFrame.
	 */
	private loop = (time: number): void => {
		if (!this.isRunning) return;

		const deltaTime = (time - this.lastTime) / 1000; // Convert to seconds
		this.lastTime = time;

		this.onUpdate(deltaTime);
		this.onRender();

		this.animationFrameId = requestAnimationFrame(this.loop);
	};
}
