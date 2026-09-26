import * as THREE from 'three';
import { BLOCKS, BLOCK_DEFS } from './Blocks.js';

// Base class for all Mobs ensuring strict solid block collision (CANNOT walk through walls)
export class BaseMob {
  constructor(x, y, z, world, audioEngine) {
    this.world = world;
    this.audioEngine = audioEngine;
    this.position = new THREE.Vector3(x, y, z);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.isDead = false;
    this.hitFlashTimer = 0;
    this.walkTimer = 0;
    this.radius = 0.35;
    this.height = 1.8;
    this.group = new THREE.Group();
  }

  checkBlockCollision(x, y, z) {
    const minX = Math.floor(x - this.radius);
    const maxX = Math.floor(x + this.radius);
    const minY = Math.floor(y);
    const maxY = Math.floor(y + this.height);
    const minZ = Math.floor(z - this.radius);
    const maxZ = Math.floor(z + this.radius);

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

  moveWithCollision(dirX, dirZ, speed, delta) {
    const stepDist = speed * delta;
    let moved = false;

    // Try X
    const nextX = this.position.x + dirX * stepDist;
    if (!this.checkBlockCollision(nextX, this.position.y, this.position.z)) {
      this.position.x = nextX;
      moved = true;
    } else if (!this.checkBlockCollision(nextX, this.position.y + 1.05, this.position.z)) {
      this.position.x = nextX;
      this.position.y += 1.05;
      moved = true;
    }

    // Try Z
    const nextZ = this.position.z + dirZ * stepDist;
    if (!this.checkBlockCollision(this.position.x, this.position.y, nextZ)) {
      this.position.z = nextZ;
      moved = true;
    } else if (!this.checkBlockCollision(this.position.x, this.position.y + 1.05, nextZ)) {
      this.position.z = nextZ;
      this.position.y += 1.05;
      moved = true;
    }

    // Gravity
    if (!this.checkBlockCollision(this.position.x, this.position.y - 0.15, this.position.z)) {
      this.position.y = Math.max(0, this.position.y - 14 * delta);
    }

    return moved;
  }

  checkRayHit(origin, direction, maxDist = 5.0) {
    if (this.isDead) return false;

    const vX = this.position.x - origin.x;
    const vZ = this.position.z - origin.z;
    const dirX = direction.x;
    const dirZ = direction.z;
    const lenSqXZ = dirX * dirX + dirZ * dirZ;

    if (lenSqXZ < 0.0001) {
      const distXZ = Math.sqrt(vX * vX + vZ * vZ);
      return distXZ <= (this.radius + 0.3);
    }

    const t = (vX * dirX + vZ * dirZ) / lenSqXZ;
    if (t < 0 || t > maxDist) return false;

    const hitX = origin.x + t * dirX;
    const hitZ = origin.z + t * dirZ;
    const hitY = origin.y + t * direction.y;

    const dx = hitX - this.position.x;
    const dz = hitZ - this.position.z;
    const horizDistSq = dx * dx + dz * dz;

    const testRadius = this.radius + 0.35;
    if (horizDistSq <= (testRadius * testRadius)) {
      if (hitY >= this.position.y - 0.2 && hitY <= this.position.y + this.height + 0.3) {
        return true;
      }
    }
    return false;
  }

  die() {
    this.isDead = true;
    this.world.scene.remove(this.group);
  }
}

// 1. Classic Zombie
export class ZombieMob extends BaseMob {
  constructor(x, y, z, world, audioEngine) {
    super(x, y, z, world, audioEngine);
    this.name = '僵尸 (Zombie)';
    this.speed = 2.2;
    this.health = 20;
    this.maxHealth = 20;
    this.attackCooldown = 0;
    this.groanTimer = 2 + Math.random() * 8;
    this.burnTimer = 0;

    this.createModel();
    this.group.position.copy(this.position);
    this.world.scene.add(this.group);
  }

  createModel() {
    // Head
    const headCanvas = document.createElement('canvas');
    headCanvas.width = 16; headCanvas.height = 16;
    const ctx = headCanvas.getContext('2d');
    ctx.fillStyle = '#49743c'; ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = '#111e0e'; ctx.fillRect(3, 7, 3, 2); ctx.fillRect(10, 7, 3, 2);
    ctx.fillStyle = '#22381b'; ctx.fillRect(5, 12, 6, 2);
    const headTex = new THREE.CanvasTexture(headCanvas);
    headTex.magFilter = THREE.NearestFilter;
    const headMat = new THREE.MeshStandardMaterial({ map: headTex, roughness: 0.9 });
    this.headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), headMat);
    this.headMesh.position.y = 1.65;
    this.headMesh.castShadow = true;
    this.group.add(this.headMesh);

    // Torso
    this.bodyMat = new THREE.MeshStandardMaterial({ color: 0x1f8087, roughness: 0.9 });
    this.bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.72, 0.3), this.bodyMat);
    this.bodyMesh.position.y = 1.05;
    this.group.add(this.bodyMesh);

    // Outstretched Arms
    const armMat = new THREE.MeshStandardMaterial({ color: 0x49743c, roughness: 0.9 });
    const armGeom = new THREE.BoxGeometry(0.18, 0.65, 0.18);
    this.leftArm = new THREE.Mesh(armGeom, armMat);
    this.leftArm.position.set(-0.35, 1.25, 0.28);
    this.leftArm.rotation.x = -Math.PI / 2;
    this.group.add(this.leftArm);

    this.rightArm = new THREE.Mesh(armGeom, armMat);
    this.rightArm.position.set(0.35, 1.25, 0.28);
    this.rightArm.rotation.x = -Math.PI / 2;
    this.group.add(this.rightArm);

    // Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0x24335c, roughness: 0.9 });
    const legGeom = new THREE.BoxGeometry(0.2, 0.65, 0.2);
    this.leftLeg = new THREE.Mesh(legGeom, legMat);
    this.leftLeg.position.set(-0.13, 0.325, 0);
    this.group.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeom, legMat);
    this.rightLeg.position.set(0.13, 0.325, 0);
    this.group.add(this.rightLeg);

    this.parts = [this.headMesh, this.bodyMesh, this.leftArm, this.rightArm, this.leftLeg, this.rightLeg];
  }

  update(delta, player, dayNight) {
    if (this.isDead) return;

    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= delta;
      if (this.hitFlashTimer <= 0) {
        for (const p of this.parts) p.material.color.setHex(0xffffff);
      }
    }

    // Burn in daylight
    if (dayNight && dayNight.isDay && dayNight.isDay()) {
      const topBlock = this.world.getBlock(Math.floor(this.position.x), Math.floor(this.position.y + 2), Math.floor(this.position.z));
      if (topBlock === BLOCKS.AIR) {
        this.burnTimer += delta;
        if (this.burnTimer >= 1.0) {
          this.burnTimer = 0;
          this.takeDamage(3);
        }
      }
    }

    // Groans
    this.groanTimer -= delta;
    if (this.groanTimer <= 0) {
      this.groanTimer = 10 + Math.random() * 12;
      if (this.position.distanceTo(player.position) < 18) {
        this.audioEngine.playSound('zombie');
      }
    }

    if (this.attackCooldown > 0) this.attackCooldown -= delta;

    // AI Chasing (only targets survival & hardcore)
    const canTarget = player.gameMode === 'survival' || player.gameMode === 'hardcore';
    const distToPlayer = this.position.distanceTo(player.position);

    if (canTarget && distToPlayer < 24) {
      const dx = player.position.x - this.position.x;
      const dz = player.position.z - this.position.z;
      this.group.rotation.y = Math.atan2(dx, dz);

      if (distToPlayer < 1.4 && this.attackCooldown <= 0) {
        this.attackCooldown = 1.2;
        player.takeDamage(player.gameMode === 'hardcore' ? 5 : 3);
        player.velocity.add(new THREE.Vector3(dx, 0.4, dz).normalize().multiplyScalar(6));
      } else if (distToPlayer >= 1.2) {
        const moveDir = new THREE.Vector2(dx, dz).normalize();
        this.moveWithCollision(moveDir.x, moveDir.y, this.speed, delta);
        this.walkTimer += delta * 7;
        this.leftLeg.rotation.x = Math.sin(this.walkTimer) * 0.55;
        this.rightLeg.rotation.x = -Math.sin(this.walkTimer) * 0.55;
      }
    }

    this.group.position.copy(this.position);
  }

  takeDamage(amount, knockbackDir = null) {
    if (this.isDead) return;
    this.health -= amount;
    this.audioEngine.playSound('zombie_hurt');
    this.hitFlashTimer = 0.2;
    for (const p of this.parts) p.material.color.setHex(0xff3333);

    if (knockbackDir) {
      const impulse = knockbackDir.clone().normalize().multiplyScalar(0.7);
      const nx = this.position.x + impulse.x;
      const nz = this.position.z + impulse.z;
      if (!this.checkBlockCollision(nx, this.position.y, nz)) {
        this.position.x = nx;
        this.position.z = nz;
      }
    }

    if (this.health <= 0) this.die();
  }
}

// 2. Creeper (苦力怕) - Sneaks, hisses "Sssss...", inflates and explodes!
export class CreeperMob extends BaseMob {
  constructor(x, y, z, world, audioEngine, onExplodeCallback = null) {
    super(x, y, z, world, audioEngine);
    this.name = '苦力怕 (Creeper)';
    this.speed = 2.4;
    this.health = 20;
    this.maxHealth = 20;
    this.fuseTime = 0;
    this.isIgnited = false;
    this.onExplodeCallback = onExplodeCallback;

    this.createModel();
    this.group.position.copy(this.position);
    this.world.scene.add(this.group);
  }

  createModel() {
    // Camo Green Head with Sad Face
    const canvas = document.createElement('canvas');
    canvas.width = 16; canvas.height = 16;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#449635'; ctx.fillRect(0, 0, 16, 16);
    // Mottled pixels
    ctx.fillStyle = '#2c7020';
    for (let i = 0; i < 20; i++) ctx.fillRect(Math.floor(Math.random() * 16), Math.floor(Math.random() * 16), 1, 1);
    // Iconic Creeper Face
    ctx.fillStyle = '#000000';
    ctx.fillRect(3, 4, 3, 3); // Eye left
    ctx.fillRect(10, 4, 3, 3); // Eye right
    ctx.fillRect(6, 7, 4, 4); // Mouth top
    ctx.fillRect(5, 9, 6, 4); // Mouth mid
    ctx.fillRect(5, 13, 2, 2); // Mouth left
    ctx.fillRect(9, 13, 2, 2); // Mouth right
    const headTex = new THREE.CanvasTexture(canvas);
    headTex.magFilter = THREE.NearestFilter;

    this.headMat = new THREE.MeshStandardMaterial({ map: headTex, roughness: 0.8 });
    this.headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.52, 0.52), this.headMat);
    this.headMesh.position.y = 1.4;
    this.headMesh.castShadow = true;
    this.group.add(this.headMesh);

    // Green Torso
    this.bodyMat = new THREE.MeshStandardMaterial({ color: 0x449635, roughness: 0.8 });
    this.bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.65, 0.28), this.bodyMat);
    this.bodyMesh.position.y = 0.85;
    this.group.add(this.bodyMesh);

    // 4 Short Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0x3b852d, roughness: 0.8 });
    const legGeom = new THREE.BoxGeometry(0.2, 0.45, 0.2);
    this.legs = [];
    const offsets = [
      [-0.15, 0.225, 0.15],
      [0.15, 0.225, 0.15],
      [-0.15, 0.225, -0.15],
      [0.15, 0.225, -0.15]
    ];
    for (const [lx, ly, lz] of offsets) {
      const leg = new THREE.Mesh(legGeom, legMat);
      leg.position.set(lx, ly, lz);
      this.group.add(leg);
      this.legs.push(leg);
    }

    this.parts = [this.headMesh, this.bodyMesh, ...this.legs];
  }

  update(delta, player) {
    if (this.isDead) return;

    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= delta;
      if (this.hitFlashTimer <= 0) {
        for (const p of this.parts) p.material.color.setHex(0xffffff);
      }
    }

    const canTarget = player.gameMode === 'survival' || player.gameMode === 'hardcore';
    const distToPlayer = this.position.distanceTo(player.position);

    if (canTarget && distToPlayer < 20) {
      const dx = player.position.x - this.position.x;
      const dz = player.position.z - this.position.z;
      this.group.rotation.y = Math.atan2(dx, dz);

      if (distToPlayer <= 3.2) {
        // Stop and ignite fuse!
        if (!this.isIgnited) {
          this.isIgnited = true;
          this.audioEngine.playSound('hiss');
        }
        this.fuseTime += delta;
        // Inflate / swell effect
        const swell = 1.0 + (this.fuseTime / 1.5) * 0.4;
        this.group.scale.set(swell, swell, swell);
        // Flash white
        const flash = Math.sin(this.fuseTime * 25) > 0;
        for (const p of this.parts) p.material.color.setHex(flash ? 0xffffff : 0x449635);

        if (this.fuseTime >= 1.5) {
          this.explode(player);
          return;
        }
      } else {
        // Reset fuse if player ran away
        if (this.isIgnited) {
          this.fuseTime = Math.max(0, this.fuseTime - delta * 2);
          if (this.fuseTime <= 0) {
            this.isIgnited = false;
            this.group.scale.set(1, 1, 1);
            for (const p of this.parts) p.material.color.setHex(0xffffff);
          }
        }
        // Walk towards player
        const moveDir = new THREE.Vector2(dx, dz).normalize();
        this.moveWithCollision(moveDir.x, moveDir.y, this.speed, delta);
        this.walkTimer += delta * 8;
        for (let i = 0; i < 4; i++) {
          this.legs[i].rotation.x = Math.sin(this.walkTimer + i * Math.PI) * 0.45;
        }
      }
    }

    this.group.position.copy(this.position);
  }

  explode(player) {
    this.die();
    this.audioEngine.playSound('explode');

    // Blow up blocks and damage player
    if (this.onExplodeCallback) {
      this.onExplodeCallback(this.position.x, this.position.y, this.position.z, 3.2);
    }
  }

  takeDamage(amount, knockbackDir = null) {
    if (this.isDead) return;
    this.health -= amount;
    this.audioEngine.playSound('zombie_hurt');
    this.hitFlashTimer = 0.2;
    for (const p of this.parts) p.material.color.setHex(0xff3333);

    if (this.health <= 0) this.die();
  }
}

// 3. Skeleton (骷髅弓箭手) - Ranged attacker
export class SkeletonMob extends BaseMob {
  constructor(x, y, z, world, audioEngine) {
    super(x, y, z, world, audioEngine);
    this.name = '骷髅 (Skeleton)';
    this.speed = 2.1;
    this.health = 20;
    this.maxHealth = 20;
    this.shootCooldown = 2.0;

    this.createModel();
    this.group.position.copy(this.position);
    this.world.scene.add(this.group);
  }

  createModel() {
    const boneMat = new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.9 });
    // Head with dark eye sockets
    const canvas = document.createElement('canvas');
    canvas.width = 16; canvas.height = 16;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#dedede'; ctx.fillRect(0, 0, 16, 16);
    ctx.fillStyle = '#1c1c1c'; ctx.fillRect(3, 6, 3, 3); ctx.fillRect(10, 6, 3, 3);
    ctx.fillRect(7, 10, 2, 2); ctx.fillRect(4, 12, 8, 2);
    const headTex = new THREE.CanvasTexture(canvas);
    headTex.magFilter = THREE.NearestFilter;
    const skullMat = new THREE.MeshStandardMaterial({ map: headTex, roughness: 0.9 });

    this.headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.48), skullMat);
    this.headMesh.position.y = 1.65;
    this.group.add(this.headMesh);

    // Ribcage Body
    this.bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.68, 0.2), boneMat);
    this.bodyMesh.position.y = 1.05;
    this.group.add(this.bodyMesh);

    // Bone Arms
    const armGeom = new THREE.BoxGeometry(0.12, 0.65, 0.12);
    this.leftArm = new THREE.Mesh(armGeom, boneMat);
    this.leftArm.position.set(-0.3, 1.25, 0.2);
    this.leftArm.rotation.x = -Math.PI / 2.5;
    this.group.add(this.leftArm);

    this.rightArm = new THREE.Mesh(armGeom, boneMat);
    this.rightArm.position.set(0.3, 1.25, 0.2);
    this.rightArm.rotation.x = -Math.PI / 2.5;
    this.group.add(this.rightArm);

    // Bone Legs
    const legGeom = new THREE.BoxGeometry(0.12, 0.65, 0.12);
    this.leftLeg = new THREE.Mesh(legGeom, boneMat);
    this.leftLeg.position.set(-0.12, 0.325, 0);
    this.group.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeom, boneMat);
    this.rightLeg.position.set(0.12, 0.325, 0);
    this.group.add(this.rightLeg);

    this.parts = [this.headMesh, this.bodyMesh, this.leftArm, this.rightArm, this.leftLeg, this.rightLeg];
  }

  update(delta, player, dayNight) {
    if (this.isDead) return;

    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= delta;
      if (this.hitFlashTimer <= 0) {
        for (const p of this.parts) p.material.color.setHex(0xffffff);
      }
    }

    if (this.shootCooldown > 0) this.shootCooldown -= delta;

    const canTarget = player.gameMode === 'survival' || player.gameMode === 'hardcore';
    const distToPlayer = this.position.distanceTo(player.position);

    if (canTarget && distToPlayer < 22) {
      const dx = player.position.x - this.position.x;
      const dz = player.position.z - this.position.z;
      this.group.rotation.y = Math.atan2(dx, dz);

      if (distToPlayer < 14 && this.shootCooldown <= 0) {
        // Shoot arrow / attack player
        this.shootCooldown = 2.5;
        this.audioEngine.playSound('skeleton_clatter');
        player.takeDamage(player.gameMode === 'hardcore' ? 4 : 2);
      } else if (distToPlayer >= 8) {
        const moveDir = new THREE.Vector2(dx, dz).normalize();
        this.moveWithCollision(moveDir.x, moveDir.y, this.speed, delta);
      }
    }

    this.group.position.copy(this.position);
  }

  takeDamage(amount, knockbackDir = null) {
    if (this.isDead) return;
    this.health -= amount;
    this.audioEngine.playSound('zombie_hurt');
    this.hitFlashTimer = 0.2;
    for (const p of this.parts) p.material.color.setHex(0xff3333);
    if (this.health <= 0) this.die();
  }
}

// 4. Friendly Pig (小猪) - Passive wandering animal
export class PigMob extends BaseMob {
  constructor(x, y, z, world, audioEngine) {
    super(x, y, z, world, audioEngine);
    this.name = '小猪 (Pig)';
    this.speed = 1.4;
    this.health = 10;
    this.maxHealth = 10;
    this.oinkTimer = 4 + Math.random() * 10;
    this.wanderTimer = 2;
    this.wanderDir = new THREE.Vector2(0, 0);

    this.createModel();
    this.group.position.copy(this.position);
    this.world.scene.add(this.group);
  }

  createModel() {
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xf5a5a5, roughness: 0.8 });
    const snoutMat = new THREE.MeshStandardMaterial({ color: 0xe88a8a, roughness: 0.8 });

    // Head
    this.headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), pinkMat);
    this.headMesh.position.set(0, 0.65, 0.35);
    this.group.add(this.headMesh);

    // Snout
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.1), snoutMat);
    snout.position.set(0, -0.05, 0.25);
    this.headMesh.add(snout);

    // Body
    this.bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.75), pinkMat);
    this.bodyMesh.position.set(0, 0.55, -0.1);
    this.group.add(this.bodyMesh);

    // 4 Short Pink Legs
    const legGeom = new THREE.BoxGeometry(0.16, 0.32, 0.16);
    this.legs = [];
    const offsets = [
      [-0.18, 0.16, 0.18],
      [0.18, 0.16, 0.18],
      [-0.18, 0.16, -0.35],
      [0.18, 0.16, -0.35]
    ];
    for (const [lx, ly, lz] of offsets) {
      const leg = new THREE.Mesh(legGeom, pinkMat);
      leg.position.set(lx, ly, lz);
      this.group.add(leg);
      this.legs.push(leg);
    }

    this.parts = [this.headMesh, this.bodyMesh, snout, ...this.legs];
  }

  update(delta, player) {
    if (this.isDead) return;

    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= delta;
      if (this.hitFlashTimer <= 0) {
        for (const p of this.parts) p.material.color.setHex(0xffffff);
      }
    }

    // Oink sound
    this.oinkTimer -= delta;
    if (this.oinkTimer <= 0) {
      this.oinkTimer = 12 + Math.random() * 15;
      if (this.position.distanceTo(player.position) < 15) {
        this.audioEngine.playSound('pig');
      }
    }

    // Peaceful wander
    this.wanderTimer -= delta;
    if (this.wanderTimer <= 0) {
      this.wanderTimer = 3 + Math.random() * 5;
      const angle = Math.random() * Math.PI * 2;
      this.wanderDir.set(Math.cos(angle), Math.sin(angle));
      this.group.rotation.y = angle;
    }

    this.moveWithCollision(this.wanderDir.x, this.wanderDir.y, this.speed, delta);
    this.walkTimer += delta * 6;
    for (let i = 0; i < 4; i++) {
      this.legs[i].rotation.x = Math.sin(this.walkTimer + i * Math.PI) * 0.4;
    }

    this.group.position.copy(this.position);
  }

  takeDamage(amount) {
    if (this.isDead) return;
    this.health -= amount;
    this.audioEngine.playSound('pig');
    this.hitFlashTimer = 0.2;
    for (const p of this.parts) p.material.color.setHex(0xff3333);
    if (this.health <= 0) this.die();
  }
}

// Unified Mob Manager
export class MobManager {
  constructor(world, audioEngine, onExplodeCallback = null) {
    this.world = world;
    this.audioEngine = audioEngine;
    this.onExplodeCallback = onExplodeCallback;
    this.mobs = [];
    this.spawnTimer = 2.0;

    this.initInitialMobs();
  }

  initInitialMobs() {
    // Spawn friendly pigs around village & plains immediately so player sees them
    for (let i = 0; i < 3; i++) {
      const px = 14 + i * 5;
      const pz = 12 + i * 4;
      const py = this.world.generator.getHeight(px, pz) + 1;
      this.mobs.push(new PigMob(px, py, pz, this.world, this.audioEngine));
    }

    // Spawn 1 Zombie and 1 Creeper nearby in cave/shade so user sees them right away
    const zx = 32; const zz = 15;
    const zy = this.world.generator.getHeight(zx, zz) + 1;
    this.mobs.push(new ZombieMob(zx, zy, zz, this.world, this.audioEngine));

    const cx = 8; const cz = 26;
    const cy = this.world.generator.getHeight(cx, cz) + 1;
    this.mobs.push(new CreeperMob(cx, cy, cz, this.world, this.audioEngine, this.onExplodeCallback));
  }

  spawnMob(type, x, y, z) {
    let mob = null;
    if (type === 'zombie') mob = new ZombieMob(x, y, z, this.world, this.audioEngine);
    else if (type === 'creeper') mob = new CreeperMob(x, y, z, this.world, this.audioEngine, this.onExplodeCallback);
    else if (type === 'skeleton') mob = new SkeletonMob(x, y, z, this.world, this.audioEngine);
    else if (type === 'pig') mob = new PigMob(x, y, z, this.world, this.audioEngine);

    if (mob) this.mobs.push(mob);
    return mob;
  }

  update(delta, player, dayNight) {
    // Periodic Night/Wild Mob Spawner
    this.spawnTimer -= delta;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = 8 + Math.random() * 6;
      if (this.mobs.length < 10 && player.gameMode !== 'spectator') {
        const types = (dayNight && dayNight.isNight && dayNight.isNight())
          ? ['zombie', 'creeper', 'skeleton']
          : ['pig', 'creeper'];
        const chosen = types[Math.floor(Math.random() * types.length)];
        const angle = Math.random() * Math.PI * 2;
        const dist = 16 + Math.random() * 12;
        const sx = Math.floor(player.position.x + Math.cos(angle) * dist);
        const sz = Math.floor(player.position.z + Math.sin(angle) * dist);
        const sy = this.world.generator.getHeight(sx, sz) + 1;
        if (sy > 0 && sy < 60) {
          this.spawnMob(chosen, sx, sy, sz);
        }
      }
    }

    for (let i = this.mobs.length - 1; i >= 0; i--) {
      const mob = this.mobs[i];
      mob.update(delta, player, dayNight);
      const dist = mob.position.distanceTo(player.position);
      if (mob.isDead || dist > 65) {
        if (!mob.isDead) mob.die();
        this.mobs.splice(i, 1);
      }
    }
  }

  raycast(origin, direction, maxDist = 5.5) {
    for (const mob of this.mobs) {
      if (mob.checkRayHit(origin, direction, maxDist)) {
        return mob;
      }
    }
    return null;
  }
}
