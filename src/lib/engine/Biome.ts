/**
 * Represents a biome type in the world.
 */
export interface Biome {
    /** The display name of the biome. */
    name: string;
    /** The hex color code used for rendering the biome. */
    color: string;
    /** Minimum elevation required for this biome (range -1.0 to 1.0). */
    minElevation: number;
    /** Minimum moisture required for this biome (range -1.0 to 1.0). */
    minMoisture: number;
}

/**
 * List of available biomes and their generation criteria.
 * Ordered generally from lowest elevation/moisture to highest.
 */
export const BIOMES: Biome[] = [
    { name: 'Deep Water', color: '#1e3a8a', minElevation: -1.0, minMoisture: -1.0 },
    { name: 'Water', color: '#3b82f6', minElevation: -0.2, minMoisture: -1.0 },
    { name: 'Sand', color: '#fcd34d', minElevation: 0.0, minMoisture: -1.0 },
    { name: 'Grass', color: '#22c55e', minElevation: 0.1, minMoisture: -0.2 },
    { name: 'Forest', color: '#15803d', minElevation: 0.1, minMoisture: 0.2 },
    { name: 'Mountain', color: '#57534e', minElevation: 0.6, minMoisture: -1.0 },
    { name: 'Snow', color: '#f3f4f6', minElevation: 0.8, minMoisture: -1.0 },
];

/**
 * Determines the biome for a given location based on environmental factors.
 * 
 * @param elevation - The height of the terrain at this point.
 * @param moisture - The moisture/humidity level at this point.
 * @returns The matching Biome object.
 */
export function getBiome(elevation: number, moisture: number): Biome {
    // Simple logic: Water override
    if (elevation < 0) {
        if (elevation < -0.25) return BIOMES.find(b => b.name === 'Deep Water')!;
        return BIOMES.find(b => b.name === 'Water')!;
    }

    // Land logic
    if (elevation > 0.8) return BIOMES.find(b => b.name === 'Snow')!;
    if (elevation > 0.6) return BIOMES.find(b => b.name === 'Mountain')!;

    // Flat lands dependent on moisture
    if (moisture < -0.2) return BIOMES.find(b => b.name === 'Sand')!;
    if (moisture > 0.3) return BIOMES.find(b => b.name === 'Forest')!;

    return BIOMES.find(b => b.name === 'Grass')!;
}
