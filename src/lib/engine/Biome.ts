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
 * Handles dynamic biome generation based on a world seed.
 */
export class BiomeGenerator {
	private biomes: Biome[] = [];
	private waterLevel: number = 0; // -0.2 is default
	private moistureBias: number = 0; // 0 is default

	constructor(seed: string) {
		this.generatePalette(seed);
	}

	public getBiomes(): Biome[] {
		return this.biomes;
	}

	private generatePalette(seed: string) {
		const rng = new Random(seed);

		// Planet Personality
		const alienMode = rng.nextFloat() > 0.3; // 70% chance of alien colors
		const baseHue = rng.nextFloat() * 360;

		// Planet Type (Dry, Wet, Normal)
		const planetType = rng.nextFloat();
		if (planetType < 0.2) {
			this.waterLevel = -0.6; // Dry
			this.moistureBias = -0.3;
		} else if (planetType > 0.8) {
			this.waterLevel = 0.3; // Water World
			this.moistureBias = 0.2;
		} else {
			this.waterLevel = -0.2; // Normal
			this.moistureBias = 0;
		}

		// Color Generators
		const getWaterColor = (depth: number) => {
			if (!alienMode) return depth === 1 ? '#1e3a8a' : '#3b82f6';
			const hue = (baseHue + 180) % 360; // Opposite of land
			const lightness = depth === 1 ? 30 : 50;
			return `hsl(${hue}, 70%, ${lightness}%)`;
		};

		const getLandColor = (type: 'sand' | 'grass' | 'forest' | 'mountain' | 'snow') => {
			if (!alienMode) {
				switch (type) {
					case 'sand':
						return '#fcd34d';
					case 'grass':
						return '#22c55e';
					case 'forest':
						return '#15803d';
					case 'mountain':
						return '#57534e';
					case 'snow':
						return '#f3f4f6';
				}
			}

			let hue = baseHue;
			let sat = 60;
			let lig = 50;

			switch (type) {
				case 'sand':
					hue += 40;
					sat -= 20;
					lig += 20;
					break;
				case 'grass':
					hue += 0;
					break; // Base
				case 'forest':
					hue -= 10;
					lig -= 15;
					break;
				case 'mountain':
					sat = 10;
					lig = 40;
					break; // Greyish
				case 'snow':
					sat = 0;
					lig = 90;
					break; // White
			}
			return `hsl(${hue % 360}, ${sat}%, ${lig}%)`;
		};

		this.biomes = [
			{ name: 'Deep Water', color: getWaterColor(1), minElevation: -1.0, minMoisture: -1.0 },
			{ name: 'Water', color: getWaterColor(0), minElevation: this.waterLevel, minMoisture: -1.0 },
			{
				name: 'Sand',
				color: getLandColor('sand'),
				minElevation: this.waterLevel + 0.2,
				minMoisture: -1.0
			},
			{
				name: 'Grass',
				color: getLandColor('grass'),
				minElevation: this.waterLevel + 0.3,
				minMoisture: -0.2 + this.moistureBias
			},
			{
				name: 'Forest',
				color: getLandColor('forest'),
				minElevation: this.waterLevel + 0.3,
				minMoisture: 0.2 + this.moistureBias
			},
			{ name: 'Mountain', color: getLandColor('mountain'), minElevation: 0.6, minMoisture: -1.0 },
			{ name: 'Snow', color: getLandColor('snow'), minElevation: 0.8, minMoisture: -1.0 }
		];
	}

	public getBiome(elevation: number, moisture: number): Biome {
		// Water logic
		if (elevation < this.waterLevel) {
			if (elevation < this.waterLevel - 0.25)
				return this.biomes.find((b) => b.name === 'Deep Water')!;
			return this.biomes.find((b) => b.name === 'Water')!;
		}

		// Land logic
		if (elevation > 0.8) return this.biomes.find((b) => b.name === 'Snow')!;
		if (elevation > 0.6) return this.biomes.find((b) => b.name === 'Mountain')!;

		// Flat lands dependent on moisture
		const adjustedMoisture = moisture + this.moistureBias;

		if (adjustedMoisture < -0.2) return this.biomes.find((b) => b.name === 'Sand')!;
		if (adjustedMoisture > 0.3) return this.biomes.find((b) => b.name === 'Forest')!;

		return this.biomes.find((b) => b.name === 'Grass')!;
	}
}

// Simple seeded random to avoid deps
class Random {
	private seed: number;
	constructor(seedStr: string) {
		let h = 2166136261 >>> 0;
		for (let i = 0; i < seedStr.length; i++) {
			h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
		}
		this.seed = h;
	}
	nextFloat() {
		this.seed = Math.imul(this.seed ^ (this.seed >>> 16), 2246822507);
		this.seed = Math.imul(this.seed ^ (this.seed >>> 13), 3266489909);
		this.seed ^= this.seed >>> 16;
		return (this.seed >>> 0) / 4294967296;
	}
}
