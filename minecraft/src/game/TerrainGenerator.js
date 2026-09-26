import { createNoise2D, createNoise3D } from 'simplex-noise';
import { BLOCKS } from './Blocks.js';

export class TerrainGenerator {
  constructor(seed = 'minecraft123') {
    this.seed = seed;
    // Simple hash function for string seed to float
    let s = 0;
    for (let i = 0; i < seed.length; i++) {
      s = (s << 5) - s + seed.charCodeAt(i);
      s |= 0;
    }
    const randomFunc = () => {
      const x = Math.sin(s++) * 10000;
      return x - Math.floor(x);
    };

    this.noise2D = createNoise2D(randomFunc);
    this.noise3D = createNoise3D(randomFunc);
    this.waterLevel = 14;
  }

  // Get surface terrain height at block coords (x, z)
  getHeight(x, z) {
    const scale1 = 0.008;
    const scale2 = 0.03;
    
    // Continent / Base height
    const base = this.noise2D(x * scale1, z * scale1) * 18 + 20;
    // Detail hills
    const detail = this.noise2D(x * scale2, z * scale2) * 6;
    
    return Math.floor(base + detail);
  }

  // Get biome at (x, z)
  getBiome(x, z) {
    const height = this.getHeight(x, z);
    if (height <= this.waterLevel + 1) {
      return '沙滩 / 水域 (Beach / Water)';
    }
    if (height >= 34) {
      return '高山山脉 (Mountains)';
    }
    const forestNoise = this.noise2D(x * 0.02, z * 0.02);
    if (forestNoise > 0.3) {
      return '橡木森林 (Oak Forest)';
    }
    const desertNoise = this.noise2D(x * 0.015 + 50, z * 0.015 + 50);
    if (desertNoise < -0.4) {
      return '干燥平原 (Savanna / Plains)';
    }
    return '翠绿平原 (Plains)';
  }

  // Generate a chunk array [16 * 64 * 16]
  generateChunkData(chunkX, chunkZ) {
    const sizeX = 16;
    const sizeY = 64;
    const sizeZ = 16;
    const data = new Uint8Array(sizeX * sizeY * sizeZ);

    const getIndex = (x, y, z) => x + z * sizeX + y * sizeX * sizeZ;
    const setBlock = (x, y, z, type) => {
      if (x >= 0 && x < sizeX && y >= 0 && y < sizeY && z >= 0 && z < sizeZ) {
        data[getIndex(x, y, z)] = type;
      }
    };

    const worldXStart = chunkX * sizeX;
    const worldZStart = chunkZ * sizeZ;

    const treesToPlace = [];

    for (let lx = 0; lx < sizeX; lx++) {
      for (let lz = 0; lz < sizeZ; lz++) {
        const wx = worldXStart + lx;
        const wz = worldZStart + lz;

        const surfaceY = this.getHeight(wx, wz);

        for (let ly = 0; ly < sizeY; ly++) {
          if (ly === 0) {
            setBlock(lx, ly, lz, BLOCKS.BEDROCK);
          } else if (ly < surfaceY - 4) {
            // 1. 3D Noise Cave Carving (Natural underground tunnels & caverns)
            const cave1 = this.noise3D(wx * 0.045, ly * 0.055, wz * 0.045);
            const cave2 = this.noise3D(wx * 0.045 + 50, ly * 0.055 + 50, wz * 0.045 + 50);
            // Don't carve under village houses (chunk 1, 0) near surface to keep buildings stable
            const isNearVillage = chunkX === 1 && chunkZ === 0 && ly > 18;
            const isCave = !isNearVillage && (Math.abs(cave1) < 0.13 && Math.abs(cave2) < 0.13) && ly < surfaceY - 3 && ly > 3;

            if (isCave) {
              if (ly <= 7) {
                // Underground deep lava lake in bottom of caves
                setBlock(lx, ly, lz, BLOCKS.LAVA);
              } else {
                // Air cavern
                setBlock(lx, ly, lz, BLOCKS.AIR);
              }
            } else {
              // Underground Stone & Mineral Ores
              const oreNoise = this.noise3D(wx * 0.1, ly * 0.1, wz * 0.1);
              if (ly < 12 && oreNoise > 0.62) {
                setBlock(lx, ly, lz, BLOCKS.DIAMOND_ORE);
              } else if (ly < 28 && oreNoise > 0.52) {
                setBlock(lx, ly, lz, BLOCKS.IRON_ORE);
              } else if (oreNoise > 0.48) {
                setBlock(lx, ly, lz, BLOCKS.COAL_ORE);
              } else {
                setBlock(lx, ly, lz, BLOCKS.STONE);
              }
            }
          } else if (ly < surfaceY) {
            setBlock(lx, ly, lz, BLOCKS.DIRT);
          } else if (ly === surfaceY) {
            if (ly <= this.waterLevel + 1) {
              setBlock(lx, ly, lz, BLOCKS.SAND);
            } else {
              setBlock(lx, ly, lz, BLOCKS.GRASS);
              // Naturally generated pumpkin patches or flowers in plains
              if (lx >= 2 && lx <= 13 && lz >= 2 && lz <= 13) {
                const pumpkinNoise = this.noise2D(wx * 0.08, wz * 0.08);
                if (pumpkinNoise > 0.58 && Math.random() < 0.12) {
                  setBlock(lx, ly + 1, lz, BLOCKS.PUMPKIN);
                } else if (Math.random() < 0.02) {
                  setBlock(lx, ly + 1, lz, BLOCKS.FLOWER);
                } else {
                  // Random chance for tree placement
                  const treeChance = this.noise2D(wx * 0.3, wz * 0.3);
                  if (treeChance > 0.45 && Math.random() < 0.15 && chunkX !== 1) {
                    treesToPlace.push({ x: lx, y: ly + 1, z: lz });
                  }
                }
              }
            }
          } else if (ly <= this.waterLevel) {
            // Water body
            setBlock(lx, ly, lz, BLOCKS.WATER);
          } else {
            // Air
            setBlock(lx, ly, lz, BLOCKS.AIR);
          }
        }
      }
    }

    // Village Generation in chunk (1, 0)
    if (chunkX === 1 && chunkZ === 0) {
      this.generateVillage(data, sizeX, sizeY, sizeZ, worldXStart, worldZStart, setBlock, getIndex);
    } else {
      // Place trees in regular chunks
      for (const tree of treesToPlace) {
        const trunkHeight = 4 + Math.floor(Math.random() * 2);
        // Trunk
        for (let h = 0; h < trunkHeight; h++) {
          setBlock(tree.x, tree.y + h, tree.z, BLOCKS.OAK_LOG);
        }
        // Leaves canopy
        const leafStartY = tree.y + trunkHeight - 2;
        for (let ly = leafStartY; ly <= tree.y + trunkHeight + 1; ly++) {
          const radius = ly >= tree.y + trunkHeight ? 1 : 2;
          for (let dx = -radius; dx <= radius; dx++) {
            for (let dz = -radius; dz <= radius; dz++) {
              if (Math.abs(dx) === radius && Math.abs(dz) === radius && Math.random() < 0.4) continue;
              const targetX = tree.x + dx;
              const targetZ = tree.z + dz;
              if (data[getIndex(targetX, ly, targetZ)] === BLOCKS.AIR) {
                setBlock(targetX, ly, targetZ, BLOCKS.OAK_LEAVES);
              }
            }
          }
        }
      }
    }

    return data;
  }

  // Generate Village structures: houses, farm, paths, pumpkins
  generateVillage(data, sizeX, sizeY, sizeZ, worldXStart, worldZStart, setBlock, getIndex) {
    const baseY = this.getHeight(worldXStart + 8, worldZStart + 8);

    // 1. Flatten the village foundation surface
    for (let x = 1; x < 15; x++) {
      for (let z = 1; z < 15; z++) {
        // Solid ground up to baseY
        for (let y = 1; y <= baseY; y++) {
          setBlock(x, y, z, y === baseY ? BLOCKS.GRASS : BLOCKS.DIRT);
        }
        // Clear air above
        for (let y = baseY + 1; y < baseY + 10; y++) {
          setBlock(x, y, z, BLOCKS.AIR);
        }
      }
    }

    // 2. Village Gravel/Sand Paths
    for (let x = 0; x < 16; x++) {
      setBlock(x, baseY, 8, BLOCKS.COBBLESTONE); // Main E-W road
    }
    for (let z = 2; z < 14; z++) {
      setBlock(8, baseY, z, BLOCKS.SAND); // Cross road
    }

    // 3. House 1: Villager Cottage (x: 2..7, z: 2..7)
    // Floor
    for (let x = 2; x <= 7; x++) {
      for (let z = 2; z <= 7; z++) {
        setBlock(x, baseY, z, BLOCKS.COBBLESTONE);
      }
    }
    // Corner Pillars
    const corners = [[2, 2], [7, 2], [2, 7], [7, 7]];
    for (const [cx, cz] of corners) {
      for (let h = 1; h <= 4; h++) {
        setBlock(cx, baseY + h, cz, BLOCKS.OAK_LOG);
      }
    }
    // Walls
    for (let h = 1; h <= 3; h++) {
      for (let x = 3; x <= 6; x++) {
        setBlock(x, baseY + h, 2, BLOCKS.PLANKS);
        setBlock(x, baseY + h, 7, BLOCKS.PLANKS);
      }
      for (let z = 3; z <= 6; z++) {
        setBlock(2, baseY + h, z, BLOCKS.PLANKS);
        setBlock(7, baseY + h, z, BLOCKS.PLANKS);
      }
    }
    // Windows
    setBlock(4, baseY + 2, 2, BLOCKS.GLASS);
    setBlock(5, baseY + 2, 2, BLOCKS.GLASS);
    setBlock(2, baseY + 2, 4, BLOCKS.GLASS);
    setBlock(2, baseY + 2, 5, BLOCKS.GLASS);
    // Doorway opening (facing south path)
    setBlock(4, baseY + 1, 7, BLOCKS.AIR);
    setBlock(4, baseY + 2, 7, BLOCKS.AIR);

    // Roof (Pyramid / Overhang)
    for (let x = 1; x <= 8; x++) {
      for (let z = 1; z <= 8; z++) {
        setBlock(x, baseY + 4, z, BLOCKS.COBBLESTONE);
      }
    }
    for (let x = 2; x <= 7; x++) {
      for (let z = 2; z <= 7; z++) {
        setBlock(x, baseY + 5, z, BLOCKS.PLANKS);
      }
    }

    // Interior Furniture
    setBlock(3, baseY + 1, 3, BLOCKS.CRAFTING_TABLE);
    setBlock(3, baseY + 3, 3, BLOCKS.TORCH);
    setBlock(6, baseY + 1, 3, BLOCKS.BRICKS); // Fireplace/furnace stand

    // 4. House 2: Library / Blacksmith (x: 9..14, z: 2..7)
    for (let x = 9; x <= 14; x++) {
      for (let z = 2; z <= 7; z++) {
        setBlock(x, baseY, z, BLOCKS.COBBLESTONE);
      }
    }
    const corners2 = [[9, 2], [14, 2], [9, 7], [14, 7]];
    for (const [cx, cz] of corners2) {
      for (let h = 1; h <= 4; h++) {
        setBlock(cx, baseY + h, cz, BLOCKS.OAK_LOG);
      }
    }
    for (let h = 1; h <= 3; h++) {
      for (let x = 10; x <= 13; x++) {
        setBlock(x, baseY + h, 2, BLOCKS.COBBLESTONE);
        setBlock(x, baseY + h, 7, BLOCKS.COBBLESTONE);
      }
      for (let z = 3; z <= 6; z++) {
        setBlock(9, baseY + h, z, BLOCKS.COBBLESTONE);
        setBlock(14, baseY + h, z, BLOCKS.COBBLESTONE);
      }
    }
    // Windows & Door
    setBlock(11, baseY + 2, 2, BLOCKS.GLASS);
    setBlock(12, baseY + 2, 2, BLOCKS.GLASS);
    setBlock(11, baseY + 1, 7, BLOCKS.AIR);
    setBlock(11, baseY + 2, 7, BLOCKS.AIR);

    // Flat roof
    for (let x = 9; x <= 14; x++) {
      for (let z = 2; z <= 7; z++) {
        setBlock(x, baseY + 4, z, BLOCKS.COBBLESTONE);
      }
    }
    setBlock(13, baseY + 1, 3, BLOCKS.CRAFTING_TABLE);
    setBlock(10, baseY + 2, 3, BLOCKS.TORCH);

    // 5. Farmland & Pumpkin Patch (x: 2..14, z: 10..14)
    // Wooden log borders
    for (let x = 2; x <= 14; x++) {
      setBlock(x, baseY, 9, BLOCKS.OAK_LOG);
      setBlock(x, baseY, 14, BLOCKS.OAK_LOG);
    }
    for (let z = 9; z <= 14; z++) {
      setBlock(2, baseY, z, BLOCKS.OAK_LOG);
      setBlock(14, baseY, z, BLOCKS.OAK_LOG);
    }

    // Water channel in the middle
    for (let x = 3; x <= 13; x++) {
      setBlock(x, baseY, 12, BLOCKS.WATER);
    }

    // Planted crops, flowers, and PUMPKINS (南瓜头)
    for (let x = 3; x <= 13; x++) {
      setBlock(x, baseY, 10, BLOCKS.DIRT);
      setBlock(x, baseY, 11, BLOCKS.DIRT);
      setBlock(x, baseY, 13, BLOCKS.DIRT);

      // Row 1: Pumpkins and Flowers
      if (x % 3 === 0) {
        setBlock(x, baseY + 1, 10, BLOCKS.PUMPKIN);
      } else {
        setBlock(x, baseY + 1, 10, BLOCKS.FLOWER);
      }

      // Row 2: Pumpkins and Flowers
      if (x % 2 === 1) {
        setBlock(x, baseY + 1, 13, BLOCKS.PUMPKIN);
      } else {
        setBlock(x, baseY + 1, 13, BLOCKS.FLOWER);
      }
    }

    // 6. Street Lamp (Oak log post + Torch)
    setBlock(8, baseY + 1, 8, BLOCKS.OAK_LOG);
    setBlock(8, baseY + 2, 8, BLOCKS.OAK_LOG);
    setBlock(8, baseY + 3, 8, BLOCKS.OAK_LOG);
    setBlock(8, baseY + 4, 8, BLOCKS.TORCH);
  }

  // Generate a Nether Chunk (Cavern with bedrock ceiling & floor, lava ocean, netherrack, glowstone)
  generateNetherChunkData(chunkX, chunkZ) {
    const sizeX = 16;
    const sizeY = 64;
    const sizeZ = 16;
    const data = new Uint8Array(sizeX * sizeY * sizeZ);

    const getIndex = (x, y, z) => x + z * sizeX + y * sizeX * sizeZ;
    const setBlock = (x, y, z, type) => {
      if (x >= 0 && x < sizeX && y >= 0 && y < sizeY && z >= 0 && z < sizeZ) {
        data[getIndex(x, y, z)] = type;
      }
    };

    const worldXStart = chunkX * sizeX;
    const worldZStart = chunkZ * sizeZ;
    const lavaLevel = 16;

    for (let lx = 0; lx < sizeX; lx++) {
      for (let lz = 0; lz < sizeZ; lz++) {
        const wx = worldXStart + lx;
        const wz = worldZStart + lz;

        for (let ly = 0; ly < sizeY; ly++) {
          if (ly === 0 || ly === sizeY - 1) {
            // Bedrock Floor (y=0) and Ceiling (y=63)
            setBlock(lx, ly, lz, BLOCKS.BEDROCK);
          } else if (ly <= 3 || ly >= sizeY - 4) {
            setBlock(lx, ly, lz, BLOCKS.NETHERRACK);
          } else {
            // 3D Cavern Noise
            const noise = this.noise3D(wx * 0.06, ly * 0.07, wz * 0.06);
            // Solid netherrack ridges and cavern openings
            const heightBias = Math.abs(ly - 32) / 32; // Higher density near floor & ceiling
            const density = noise + heightBias * 0.45;

            if (density > 0.32) {
              // Hanging Glowstone clusters near high ceiling
              if (ly > 42 && density > 0.6) {
                setBlock(lx, ly, lz, BLOCKS.GLOWSTONE);
              } else {
                setBlock(lx, ly, lz, BLOCKS.NETHERRACK);
              }
            } else if (ly <= lavaLevel) {
              // Lava ocean at bottom of Nether caverns
              setBlock(lx, ly, lz, BLOCKS.LAVA);
            }
          }
        }
      }
    }

    // Spawn Portal Platform at Nether Origin Chunk (0, 0)
    if (chunkX === 0 && chunkZ === 0) {
      const baseY = 18;
      // Obsidian platform (5x5)
      for (let x = 5; x <= 10; x++) {
        for (let z = 5; z <= 10; z++) {
          setBlock(x, baseY, z, BLOCKS.OBSIDIAN);
          // Clear air above platform
          for (let y = baseY + 1; y <= baseY + 6; y++) {
            setBlock(x, y, z, BLOCKS.AIR);
          }
        }
      }

      // Return Nether Portal Frame (x: 7..9, y: 19..22, z: 7)
      // Base
      setBlock(7, baseY + 1, 7, BLOCKS.OBSIDIAN);
      setBlock(8, baseY + 1, 7, BLOCKS.OBSIDIAN);
      setBlock(9, baseY + 1, 7, BLOCKS.OBSIDIAN);
      // Sides
      setBlock(7, baseY + 2, 7, BLOCKS.OBSIDIAN);
      setBlock(7, baseY + 3, 7, BLOCKS.OBSIDIAN);
      setBlock(9, baseY + 2, 7, BLOCKS.OBSIDIAN);
      setBlock(9, baseY + 3, 7, BLOCKS.OBSIDIAN);
      // Top
      setBlock(7, baseY + 4, 7, BLOCKS.OBSIDIAN);
      setBlock(8, baseY + 4, 7, BLOCKS.OBSIDIAN);
      setBlock(9, baseY + 4, 7, BLOCKS.OBSIDIAN);
      // Portal Center
      setBlock(8, baseY + 2, 7, BLOCKS.NETHER_PORTAL);
      setBlock(8, baseY + 3, 7, BLOCKS.NETHER_PORTAL);

      // Glowstone corner lights
      setBlock(5, baseY + 1, 5, BLOCKS.GLOWSTONE);
      setBlock(10, baseY + 1, 5, BLOCKS.GLOWSTONE);
      setBlock(5, baseY + 1, 10, BLOCKS.GLOWSTONE);
      setBlock(10, baseY + 1, 10, BLOCKS.GLOWSTONE);
    }

    return data;
  }
}
