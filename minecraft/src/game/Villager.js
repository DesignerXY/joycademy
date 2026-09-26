import * as THREE from 'three';
import { BLOCKS, BLOCK_DEFS } from './Blocks.js';

export class Villager {
  constructor(name, profession, startX, startZ, world, audioEngine) {
    this.name = name;
    this.profession = profession;
    this.world = world;
    this.audioEngine = audioEngine;

    this.position = new THREE.Vector3(startX, world.generator.getHeight(startX, startZ) + 1, startZ);
    this.targetPos = this.position.clone();
    this.rotationY = 0;
    this.walkSpeed = 1.6;
    this.walkTimer = 0;
    this.isWalking = false;
    this.idleWaitTimer = 2 + Math.random() * 3;
    this.hrmmTimer = 10 + Math.random() * 15;

    // Trading recipes for this villager
    this.trades = this.initTrades();

    // 3D Group
    this.group = new THREE.Group();
    this.createModel();
    this.group.position.copy(this.position);
    this.world.scene.add(this.group);
  }

  initTrades() {
    if (this.profession === 'farmer') {
      return [
        { input: { blockId: BLOCKS.PLANKS, count: 8 }, output: { blockId: BLOCKS.DIAMOND, count: 1 }, title: '8 橡木木板 -> 1 钻石' },
        { input: { blockId: BLOCKS.FLOWER, count: 4 }, output: { blockId: BLOCKS.PUMPKIN, count: 1 }, title: '4 小黄花 -> 1 南瓜头' },
        { input: { blockId: BLOCKS.DIRT, count: 16 }, output: { blockId: BLOCKS.SAND, count: 8 }, title: '16 泥土 -> 8 沙子' },
        { input: { blockId: BLOCKS.WATER_BUCKET, count: 1 }, output: { blockId: BLOCKS.DIAMOND, count: 2 }, title: '1 水桶 -> 2 钻石' }
      ];
    } else if (this.profession === 'blacksmith') {
      return [
        { input: { blockId: BLOCKS.IRON_ORE, count: 3 }, output: { blockId: BLOCKS.BUCKET, count: 1 }, title: '3 铁矿石 -> 1 铁桶' },
        { input: { blockId: BLOCKS.IRON_ORE, count: 3, secondary: { blockId: BLOCKS.STICK, count: 2 } }, output: { blockId: BLOCKS.IRON_PICKAXE, count: 1 }, title: '3 铁矿 + 2 木棍 -> 1 铁镐' },
        { input: { blockId: BLOCKS.DIAMOND, count: 2, secondary: { blockId: BLOCKS.STICK, count: 1 } }, output: { blockId: BLOCKS.DIAMOND_SWORD, count: 1 }, title: '2 钻石 + 1 木棍 -> 1 钻石剑' },
        { input: { blockId: BLOCKS.OBSIDIAN, count: 4 }, output: { blockId: BLOCKS.NETHER_PORTAL, count: 1 }, title: '4 黑曜石 -> 1 下界传送门' },
        { input: { blockId: BLOCKS.COAL_ORE, count: 4 }, output: { blockId: BLOCKS.TORCH, count: 8 }, title: '4 煤矿石 -> 8 火把' },
        { input: { blockId: BLOCKS.COBBLESTONE, count: 12 }, output: { blockId: BLOCKS.BRICKS, count: 8 }, title: '12 圆石 -> 8 红砖' }
      ];
    } else {
      return [
        { input: { blockId: BLOCKS.PUMPKIN, count: 1 }, output: { blockId: BLOCKS.DIAMOND, count: 2 }, title: '1 南瓜头 -> 2 钻石' },
        { input: { blockId: BLOCKS.DIAMOND, count: 3 }, output: { blockId: BLOCKS.OBSIDIAN, count: 2 }, title: '3 钻石 -> 2 黑曜石' },
        { input: { blockId: BLOCKS.SAND, count: 8 }, output: { blockId: BLOCKS.GLASS, count: 8 }, title: '8 沙子 -> 8 玻璃' },
        { input: { blockId: BLOCKS.OAK_LOG, count: 4 }, output: { blockId: BLOCKS.TNT, count: 1 }, title: '4 橡木原木 -> 1 TNT' }
      ];
    }
  }

  createModel() {
    // 1. Head Canvas Texture
    const headCanvas = document.createElement('canvas');
    headCanvas.width = 16;
    headCanvas.height = 16;
    const hctx = headCanvas.getContext('2d');
    hctx.fillStyle = '#bca082'; // Skin
    hctx.fillRect(0, 0, 16, 16);
    // Brown hair top
    hctx.fillStyle = '#4a2f13';
    hctx.fillRect(0, 0, 16, 4);
    // Unibrow
    hctx.fillStyle = '#3a2007';
    hctx.fillRect(2, 6, 12, 1);
    // Green Eyes
    hctx.fillStyle = '#ffffff';
    hctx.fillRect(3, 7, 3, 2);
    hctx.fillRect(10, 7, 3, 2);
    hctx.fillStyle = '#27ae60';
    hctx.fillRect(4, 7, 1, 2);
    hctx.fillRect(11, 7, 1, 2);

    const headTex = new THREE.CanvasTexture(headCanvas);
    headTex.magFilter = THREE.NearestFilter;
    headTex.minFilter = THREE.NearestFilter;
    const headMat = new THREE.MeshStandardMaterial({ map: headTex, roughness: 0.8 });

    // Head Mesh
    const headGeom = new THREE.BoxGeometry(0.48, 0.58, 0.48);
    this.headMesh = new THREE.Mesh(headGeom, headMat);
    this.headMesh.position.y = 1.65;
    this.headMesh.castShadow = true;
    this.group.add(this.headMesh);

    // Iconic Villager Nose
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xaa8e70, roughness: 0.8 });
    const noseGeom = new THREE.BoxGeometry(0.12, 0.24, 0.16);
    const nose = new THREE.Mesh(noseGeom, noseMat);
    nose.position.set(0, -0.08, 0.28);
    this.headMesh.add(nose);

    // 2. Body / Robe
    const robeColor = this.profession === 'farmer' ? 0x563c22 : (this.profession === 'blacksmith' ? 0x2c2c2c : 0x6e2c8c);
    const robeMat = new THREE.MeshStandardMaterial({ color: robeColor, roughness: 0.9 });
    const bodyGeom = new THREE.BoxGeometry(0.55, 0.75, 0.38);
    this.bodyMesh = new THREE.Mesh(bodyGeom, robeMat);
    this.bodyMesh.position.y = 1.05;
    this.bodyMesh.castShadow = true;
    this.group.add(this.bodyMesh);

    // 3. Crossed Arms in Sleeves
    const armGeom = new THREE.BoxGeometry(0.68, 0.28, 0.32);
    this.armMesh = new THREE.Mesh(armGeom, robeMat);
    this.armMesh.position.set(0, 1.08, 0.16);
    this.armMesh.rotation.x = 0.4;
    this.group.add(this.armMesh);

    // 4. Legs
    const legColor = 0x3d2817;
    const legMat = new THREE.MeshStandardMaterial({ color: legColor, roughness: 0.9 });
    const legGeom = new THREE.BoxGeometry(0.2, 0.65, 0.2);

    this.leftLeg = new THREE.Mesh(legGeom, legMat);
    this.leftLeg.position.set(-0.13, 0.325, 0);
    this.leftLeg.castShadow = true;
    this.group.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeom, legMat);
    this.rightLeg.position.set(0.13, 0.325, 0);
    this.rightLeg.castShadow = true;
    this.group.add(this.rightLeg);
  }

  update(delta, playerPos) {
    // 1. Periodic "Hrmm" sound
    this.hrmmTimer -= delta;
    if (this.hrmmTimer <= 0) {
      this.hrmmTimer = 18 + Math.random() * 15;
      const dist = this.position.distanceTo(playerPos);
      if (dist < 12) {
        this.audioEngine.playSound('villager');
      }
    }

    // 2. Face player if nearby, otherwise walk
    const distToPlayer = this.position.distanceTo(playerPos);
    if (distToPlayer < 3.2) {
      // Look towards player
      const angle = Math.atan2(playerPos.x - this.position.x, playerPos.z - this.position.z);
      this.group.rotation.y = angle;
      this.isWalking = false;
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      return;
    }

    // 3. Wandering AI
    if (this.isWalking) {
      const diffX = this.targetPos.x - this.position.x;
      const diffZ = this.targetPos.z - this.position.z;
      const dist = Math.sqrt(diffX * diffX + diffZ * diffZ);

      if (dist < 0.2) {
        this.isWalking = false;
        this.idleWaitTimer = 3 + Math.random() * 4;
        this.leftLeg.rotation.x = 0;
        this.rightLeg.rotation.x = 0;
      } else {
        const moveDir = new THREE.Vector2(diffX, diffZ).normalize();
        const stepDist = this.walkSpeed * delta;
        let blocked = false;

        // Try X move
        const nextX = this.position.x + moveDir.x * stepDist;
        if (!this.checkBlockCollision(nextX, this.position.y, this.position.z)) {
          this.position.x = nextX;
        } else if (!this.checkBlockCollision(nextX, this.position.y + 1.05, this.position.z)) {
          // 1-block step up
          this.position.x = nextX;
          this.position.y += 1.05;
        } else {
          blocked = true;
        }

        // Try Z move
        const nextZ = this.position.z + moveDir.y * stepDist;
        if (!this.checkBlockCollision(this.position.x, this.position.y, nextZ)) {
          this.position.z = nextZ;
        } else if (!this.checkBlockCollision(this.position.x, this.position.y + 1.05, nextZ)) {
          // 1-block step up
          this.position.z = nextZ;
          this.position.y += 1.05;
        } else {
          blocked = true;
        }

        // Apply gravity if falling
        if (!this.checkBlockCollision(this.position.x, this.position.y - 0.1, this.position.z)) {
          this.position.y = Math.max(0, this.position.y - 12 * delta);
        }

        if (blocked) {
          this.isWalking = false;
          this.idleWaitTimer = 1.5 + Math.random() * 2;
        }

        // Smooth rotation to face movement direction
        const targetAngle = Math.atan2(moveDir.x, moveDir.y);
        this.group.rotation.y = targetAngle;

        // Leg swing animation
        this.walkTimer += delta * 8;
        this.leftLeg.rotation.x = Math.sin(this.walkTimer) * 0.5;
        this.rightLeg.rotation.x = -Math.sin(this.walkTimer) * 0.5;
      }
    } else {
      this.idleWaitTimer -= delta;
      if (this.idleWaitTimer <= 0) {
        // Pick new random destination around village (x: 18..30, z: 4..12)
        const newX = 18 + Math.random() * 12;
        const newZ = 4 + Math.random() * 8;
        this.targetPos.set(newX, this.world.generator.getHeight(newX, newZ), newZ);
        this.isWalking = true;
      }
    }

    this.group.position.copy(this.position);
  }

  // Check AABB collision against world solid blocks (prevents walking through walls)
  checkBlockCollision(x, y, z) {
    const minX = Math.floor(x - 0.35);
    const maxX = Math.floor(x + 0.35);
    const minY = Math.floor(y);
    const maxY = Math.floor(y + 1.85);
    const minZ = Math.floor(z - 0.35);
    const maxZ = Math.floor(z + 0.35);

    for (let bx = minX; bx <= maxX; bx++) {
      for (let by = minY; by <= maxY; by++) {
        for (let bz = minZ; bz <= maxZ; bz++) {
          const blockId = this.world.getBlock(bx, by, bz);
          const def = BLOCK_DEFS[blockId] || { solid: false };
          if (def.solid) return true;
        }
      }
    }
    return false;
  }

  // Raycast bounding cylinder test (accurate across height from feet to head)
  checkRayHit(origin, direction, maxDist = 6.0) {
    // Vector from origin to villager position in XZ plane
    const vX = this.position.x - origin.x;
    const vZ = this.position.z - origin.z;
    const dirX = direction.x;
    const dirZ = direction.z;
    const lenSqXZ = dirX * dirX + dirZ * dirZ;

    if (lenSqXZ < 0.0001) {
      // Looking straight down or up
      const distXZ = Math.sqrt(vX * vX + vZ * vZ);
      return distXZ <= 0.85;
    }

    // Distance t along ray to the closest point in XZ plane
    const t = (vX * dirX + vZ * dirZ) / lenSqXZ;
    if (t < 0 || t > maxDist) return false;

    // Position of closest approach on the ray
    const hitX = origin.x + t * dirX;
    const hitZ = origin.z + t * dirZ;
    const hitY = origin.y + t * direction.y;

    const dx = hitX - this.position.x;
    const dz = hitZ - this.position.z;
    const horizDistSq = dx * dx + dz * dz;

    // Villager cylinder: radius 0.85, height: from ground (position.y - 0.2) to above head (position.y + 2.3)
    if (horizDistSq <= (0.85 * 0.85)) {
      if (hitY >= this.position.y - 0.2 && hitY <= this.position.y + 2.3) {
        return true;
      }
    }

    return false;
  }
}

export class VillagerManager {
  constructor(world, audioEngine) {
    this.world = world;
    this.audioEngine = audioEngine;
    this.villagers = [];
    this.initVillagers();
  }

  initVillagers() {
    // Spawn 3 villagers in the village (Chunk 1, 0 -> X: 18..28, Z: 4..10)
    const farmer = new Villager('农夫村民', 'farmer', 22, 6, this.world, this.audioEngine);
    const blacksmith = new Villager('铁匠村民', 'blacksmith', 27, 6, this.world, this.audioEngine);
    const merchant = new Villager('流浪商人', 'merchant', 24, 10, this.world, this.audioEngine);

    this.villagers.push(farmer, blacksmith, merchant);
  }

  update(delta, playerPos) {
    for (const v of this.villagers) {
      v.update(delta, playerPos);
    }
  }

  raycast(origin, direction, maxDist = 6.0) {
    for (const v of this.villagers) {
      if (v.checkRayHit(origin, direction, maxDist)) {
        return v;
      }
    }
    return null;
  }
}
