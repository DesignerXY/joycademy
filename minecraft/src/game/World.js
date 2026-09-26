import * as THREE from 'three';
import { BLOCKS, BLOCK_DEFS } from './Blocks.js';
import { TerrainGenerator } from './TerrainGenerator.js';

export class World {
  constructor(scene, materialManager, seed = 'minecraft123') {
    this.scene = scene;
    this.materialManager = materialManager;
    this.generator = new TerrainGenerator(seed);

    this.chunkSizeX = 16;
    this.chunkSizeY = 64;
    this.chunkSizeZ = 16;

    this.dimension = 'overworld'; // 'overworld' or 'nether'
    this.chunks = new Map(); // key 'x,z' -> Uint8Array
    this.chunkMeshes = new Map(); // key 'x,z' -> Array of Three.Mesh
    this.modifiedBlocksOverworld = new Map();
    this.modifiedBlocksNether = new Map();

    this.renderDistance = 4;
    this.dirtyChunks = new Set();
  }

  get modifiedBlocks() {
    return this.dimension === 'nether' ? this.modifiedBlocksNether : this.modifiedBlocksOverworld;
  }

  setDimension(newDimension) {
    if (this.dimension === newDimension) return;

    // Remove all chunk meshes of previous dimension
    for (const [key, meshes] of this.chunkMeshes.entries()) {
      for (const mesh of meshes) {
        this.scene.remove(mesh);
        mesh.geometry.dispose();
      }
    }
    this.chunkMeshes.clear();
    this.chunks.clear();
    this.dirtyChunks.clear();

    this.dimension = newDimension;
  }

  getChunkKey(cx, cz) {
    return `${cx},${cz}`;
  }

  getBlockKey(x, y, z) {
    return `${x},${y},${z}`;
  }

  worldToChunkCoords(x, y, z) {
    const cx = Math.floor(x / this.chunkSizeX);
    const cz = Math.floor(z / this.chunkSizeZ);
    const lx = ((x % this.chunkSizeX) + this.chunkSizeX) % this.chunkSizeX;
    const lz = ((z % this.chunkSizeZ) + this.chunkSizeZ) % this.chunkSizeZ;
    return { cx, cz, lx, ly: y, lz };
  }

  getBlock(x, y, z) {
    if (y < 0 || y >= this.chunkSizeY) return BLOCKS.AIR;

    const blockKey = this.getBlockKey(x, y, z);
    if (this.modifiedBlocks.has(blockKey)) {
      return this.modifiedBlocks.get(blockKey);
    }

    const { cx, cz, lx, ly, lz } = this.worldToChunkCoords(x, y, z);
    const chunkKey = this.getChunkKey(cx, cz);

    if (!this.chunks.has(chunkKey)) {
      const data = this.dimension === 'nether'
        ? this.generator.generateNetherChunkData(cx, cz)
        : this.generator.generateChunkData(cx, cz);
      this.chunks.set(chunkKey, data);
    }

    const data = this.chunks.get(chunkKey);
    const index = lx + lz * this.chunkSizeX + ly * this.chunkSizeX * this.chunkSizeZ;
    return data[index];
  }

  setBlock(x, y, z, blockId) {
    if (y < 0 || y >= this.chunkSizeY) return;

    const blockKey = this.getBlockKey(x, y, z);
    this.modifiedBlocks.set(blockKey, blockId);

    const { cx, cz, lx, ly, lz } = this.worldToChunkCoords(x, y, z);
    const chunkKey = this.getChunkKey(cx, cz);

    if (this.chunks.has(chunkKey)) {
      const data = this.chunks.get(chunkKey);
      const index = lx + lz * this.chunkSizeX + ly * this.chunkSizeX * this.chunkSizeZ;
      data[index] = blockId;
    }

    // Mark current chunk and neighbor chunks dirty for re-meshing
    this.markChunkDirty(cx, cz);
    if (lx === 0) this.markChunkDirty(cx - 1, cz);
    if (lx === this.chunkSizeX - 1) this.markChunkDirty(cx + 1, cz);
    if (lz === 0) this.markChunkDirty(cx, cz - 1);
    if (lz === this.chunkSizeZ - 1) this.markChunkDirty(cx, cz + 1);
  }

  markChunkDirty(cx, cz) {
    this.dirtyChunks.add(this.getChunkKey(cx, cz));
  }

  updateLoadedChunks(playerX, playerZ) {
    const playerChunkX = Math.floor(playerX / this.chunkSizeX);
    const playerChunkZ = Math.floor(playerZ / this.chunkSizeZ);

    const activeKeys = new Set();

    for (let dx = -this.renderDistance; dx <= this.renderDistance; dx++) {
      for (let dz = -this.renderDistance; dz <= this.renderDistance; dz++) {
        const cx = playerChunkX + dx;
        const cz = playerChunkZ + dz;
        const key = this.getChunkKey(cx, cz);
        activeKeys.add(key);

        if (!this.chunks.has(key)) {
          const data = this.dimension === 'nether'
            ? this.generator.generateNetherChunkData(cx, cz)
            : this.generator.generateChunkData(cx, cz);
          this.chunks.set(key, data);
          this.dirtyChunks.add(key);
        }
      }
    }

    // Unload far meshes
    for (const [key, meshes] of this.chunkMeshes.entries()) {
      if (!activeKeys.has(key)) {
        for (const mesh of meshes) {
          this.scene.remove(mesh);
          mesh.geometry.dispose();
        }
        this.chunkMeshes.delete(key);
      }
    }

    // Process dirty chunks limit per frame for smooth performance
    let processed = 0;
    for (const key of this.dirtyChunks) {
      if (processed >= 2) break; // Limit 2 chunk updates per frame
      const [cxStr, czStr] = key.split(',');
      const cx = parseInt(cxStr);
      const cz = parseInt(czStr);

      this.buildChunkMesh(cx, cz);
      this.dirtyChunks.delete(key);
      processed++;
    }
  }

  buildChunkMesh(cx, cz) {
    const key = this.getChunkKey(cx, cz);

    // Remove existing meshes for this chunk
    if (this.chunkMeshes.has(key)) {
      for (const mesh of this.chunkMeshes.get(key)) {
        this.scene.remove(mesh);
        mesh.geometry.dispose();
      }
      this.chunkMeshes.delete(key);
    }

    const chunkData = this.chunks.get(key);
    if (!chunkData) return;

    // Face Culling Data Structures per block type
    // Faces: 0: +X, 1: -X, 2: +Y, 3: -Y, 4: +Z, 5: -Z
    const blockGeometries = {};

    const neighborOffsets = [
      [1, 0, 0],   // +X
      [-1, 0, 0],  // -X
      [0, 1, 0],   // +Y
      [0, -1, 0],  // -Y
      [0, 0, 1],   // +Z
      [0, 0, -1]   // -Z
    ];

    const faceNormals = [
      [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]
    ];

    const faceUVs = [
      [0, 0,  1, 0,  1, 1,  0, 1],
      [0, 0,  1, 0,  1, 1,  0, 1],
      [0, 0,  1, 0,  1, 1,  0, 1],
      [0, 0,  1, 0,  1, 1,  0, 1],
      [0, 0,  1, 0,  1, 1,  0, 1],
      [0, 0,  1, 0,  1, 1,  0, 1]
    ];

    const faceVertices = [
      // +X
      [[1, 0, 0], [1, 0, 1], [1, 1, 1], [1, 1, 0]],
      // -X
      [[0, 0, 1], [0, 0, 0], [0, 1, 0], [0, 1, 1]],
      // +Y
      [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]],
      // -Y
      [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]],
      // +Z
      [[1, 0, 1], [0, 0, 1], [0, 1, 1], [1, 1, 1]],
      // -Z
      [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]]
    ];

    const startX = cx * this.chunkSizeX;
    const startZ = cz * this.chunkSizeZ;

    for (let lx = 0; lx < this.chunkSizeX; lx++) {
      for (let ly = 0; ly < this.chunkSizeY; ly++) {
        for (let lz = 0; lz < this.chunkSizeZ; lz++) {
          const index = lx + lz * this.chunkSizeX + ly * this.chunkSizeX * this.chunkSizeZ;
          const blockId = chunkData[index];

          if (blockId === BLOCKS.AIR) continue;

          const wx = startX + lx;
          const wy = ly;
          const wz = startZ + lz;

          for (let f = 0; f < 6; f++) {
            const [nx, ny, nz] = neighborOffsets[f];
            const neighborId = this.getBlock(wx + nx, wy + ny, wz + nz);
            const neighborDef = BLOCK_DEFS[neighborId] || { transparent: true, solid: false };

            // Render face if neighbor is air, transparent, or liquid
            // Cull adjacent identical transparent blocks (e.g. water-water, glass-glass)
            if (blockId === neighborId && (blockId === BLOCKS.WATER || blockId === BLOCKS.GLASS)) {
              continue;
            }

            if (neighborId === BLOCKS.AIR || neighborDef.transparent || (blockId !== BLOCKS.WATER && neighborId === BLOCKS.WATER)) {
              if (!blockGeometries[blockId]) {
                blockGeometries[blockId] = {
                  positions: [],
                  normals: [],
                  uvs: [],
                  faceIndices: [[], [], [], [], [], []],
                  vertCount: 0
                };
              }

              const geom = blockGeometries[blockId];
              const verts = faceVertices[f];
              const norm = faceNormals[f];

              for (let i = 0; i < 4; i++) {
                geom.positions.push(wx + verts[i][0], wy + verts[i][1], wz + verts[i][2]);
                geom.normals.push(norm[0], norm[1], norm[2]);
              }

              const uvs = faceUVs[f];
              geom.uvs.push(uvs[0], uvs[1], uvs[2], uvs[3], uvs[4], uvs[5], uvs[6], uvs[7]);

              const vc = geom.vertCount;
              geom.faceIndices[f].push(vc, vc + 1, vc + 2, vc, vc + 2, vc + 3);
              geom.vertCount += 4;
            }
          }
        }
      }
    }

    const meshes = [];

    for (const [bIdStr, geomData] of Object.entries(blockGeometries)) {
      const bId = parseInt(bIdStr);
      if (geomData.positions.length === 0) continue;

      const bufferGeometry = new THREE.BufferGeometry();
      bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(geomData.positions, 3));
      bufferGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(geomData.normals, 3));
      bufferGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(geomData.uvs, 2));

      // Build face groups for 6 multi-materials [px, nx, py(top), ny(bottom), pz, nz]
      const allIndices = [];
      let indexOffset = 0;
      for (let f = 0; f < 6; f++) {
        const count = geomData.faceIndices[f].length;
        if (count > 0) {
          bufferGeometry.addGroup(indexOffset, count, f);
          for (let i = 0; i < count; i++) {
            allIndices.push(geomData.faceIndices[f][i]);
          }
          indexOffset += count;
        }
      }
      bufferGeometry.setIndex(allIndices);

      const materials = this.materialManager.getMaterials(bId);
      const mesh = new THREE.Mesh(bufferGeometry, materials);

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
      meshes.push(mesh);
    }

    this.chunkMeshes.set(key, meshes);
  }

  getBiome(x, z) {
    return this.generator.getBiome(x, z);
  }

  // Raycast to find block targeted by player camera
  raycastBlock(origin, direction, maxDistance = 6, includeWater = false) {
    const step = 0.05;
    let currPos = origin.clone();
    const rayDir = direction.clone().normalize();

    let prevBlock = null;

    for (let d = 0; d < maxDistance; d += step) {
      currPos.addScaledVector(rayDir, step);
      const bx = Math.floor(currPos.x);
      const by = Math.floor(currPos.y);
      const bz = Math.floor(currPos.z);

      const blockId = this.getBlock(bx, by, bz);

      if (blockId !== BLOCKS.AIR) {
        if (!includeWater && (blockId === BLOCKS.WATER || blockId === BLOCKS.LAVA)) {
          prevBlock = { x: bx, y: by, z: bz };
          continue;
        }

        return {
          hit: true,
          x: bx,
          y: by,
          z: bz,
          blockId,
          placePos: prevBlock ? prevBlock : { x: bx, y: by + 1, z: bz }
        };
      }

      prevBlock = { x: bx, y: by, z: bz };
    }

    return { hit: false };
  }
}
