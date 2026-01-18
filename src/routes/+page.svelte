<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { GameLoop } from '$lib/engine/GameLoop';
    import { Renderer } from '$lib/engine/Renderer';
    import { World } from '$lib/engine/World';

    let canvas: HTMLCanvasElement;
    let renderer: Renderer;
    let gameLoop: GameLoop;
    let world: World;

    // Game State
    let fps = 0;
    let frameCount = 0;
    let timeAccumulator = 0;
    let seed = 'emerald-bohr';

    // Camera
    let cameraX = 0;
    let cameraY = 0;
    const SPEED = 50; // Tiles per second

    // Input
    const keys: Record<string, boolean> = {};

    onMount(() => {
        if (!canvas) return;

        // Initialize Input
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('wheel', handleWheel, { passive: false });

        // Initialize Engine
        initWorld();
        renderer = new Renderer(canvas);
        gameLoop = new GameLoop(update, render);

        gameLoop.start();
    });
    
    function initWorld() {
        world = new World(seed);
        // Reset camera optionally or keep it? Let's keep it.
    }

    onDestroy(() => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
             window.removeEventListener('wheel', handleWheel);
        }
        gameLoop?.stop();
        renderer?.destroy();
    });

    function handleKeyDown(e: KeyboardEvent) {
        if (e.target instanceof HTMLInputElement) return; // Don't move when typing seed
        keys[e.code] = true;
    }

    function handleKeyUp(e: KeyboardEvent) {
        keys[e.code] = false;
    }
    
    function handleWheel(e: WheelEvent) {
        if (!renderer) return;
        const currentScale = renderer.getScale();
        const delta = e.deltaY > 0 ? -1 : 1;
        renderer.setScale(currentScale + delta);
    }

    function update(deltaTime: number) {
        // FPS Calc
        frameCount++;
        timeAccumulator += deltaTime;
        if (timeAccumulator >= 1.0) {
            fps = frameCount;
            frameCount = 0;
            timeAccumulator -= 1.0;
        }

        // Movement
        if (keys['KeyW'] || keys['ArrowUp']) cameraY -= SPEED * deltaTime;
        if (keys['KeyS'] || keys['ArrowDown']) cameraY += SPEED * deltaTime;
        if (keys['KeyA'] || keys['ArrowLeft']) cameraX -= SPEED * deltaTime;
        if (keys['KeyD'] || keys['ArrowRight']) cameraX += SPEED * deltaTime;
    }

    function render() {
        if (renderer && world) {
            renderer.render(world, cameraX, cameraY);
        }
    }
</script>

<div class="relative w-full h-full font-mono">
    <!-- UI Overlay -->
    <div class="absolute top-4 left-4 p-4 bg-black/80 text-white rounded-lg backdrop-blur z-10 border border-white/10 shadow-xl">
        <h1 class="text-xl font-bold mb-4 text-emerald-400">Procedural World</h1>
        
        <div class="space-y-2 text-xs mb-4">
            <div class="flex justify-between">
                <span class="text-gray-400">FPS</span>
                <span>{fps}</span>
            </div>
             <div class="flex justify-between gap-4">
                <span class="text-gray-400">Pos</span>
                <span>{Math.floor(cameraX)}, {Math.floor(cameraY)}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-400">Zoom</span>
                <span>{renderer?.getScale().toFixed(0) || 4}x</span>
            </div>
        </div>

        <div class="mb-4">
            <label class="text-xs text-gray-400 block mb-1">Seed</label>
            <div class="flex gap-2">
                <input 
                    type="text" 
                    bind:value={seed} 
                    class="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm w-32 focus:outline-none focus:border-emerald-500"
                />
                <button 
                    onclick={initWorld}
                    class="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-sm transition-colors cursor-pointer"
                >
                    Gen
                </button>
            </div>
        </div>
        
        <div class="text-[10px] text-gray-500 pt-2 border-t border-white/10">
            <p>WASD / Arrows to Move</p>
            <p>Scroll to Zoom</p>
        </div>
    </div>

    <!-- Game Canvas -->
     <!-- svelte-ignore a11y_canvas_has_alt_text -->
    <canvas 
        bind:this={canvas}
        class="block w-full h-full touch-none focus:outline-none bg-[#0d0d0d]"
    ></canvas>
</div>
