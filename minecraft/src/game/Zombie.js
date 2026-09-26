import * as THREE from 'three';
import { BLOCKS, BLOCK_DEFS } from './Blocks.js';

export class Zombie {
  constructor(x, y, z, world, audioEngine) {
    this.world = world;
    this.audioEngine = audioEngine;

    this.position = new THREE.Vector3(x, y, z);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.speed = 2.2;
    this.health = 20;
    this.maxHealth = 20;
    this.isDead = false;

    this.attackCooldown = 0;
    this.groanTimer = 3 + Math.random() * 8;
    this.burnTimer = 0;
    this.walkTimer = 0;
    this.hitFlashTimer = 0;

    // 3D Model
    this.group = new THREE.Group();
    this.createModel();
    this.group.position.copy(this.position);
    this.world.scene.add(this.group);
  }

  createModel() {
    // 1. Zombie Head Texture (Rotting Green Skin with Dark Sunken Eyes)
    const headCanvas = document.createElement('canvas');
    headCanvas.width = 16;
    headCanvas.height = 16;
    const hctx = headCanvas.getContext('2d');
    hctx.fillStyle = '#49743c'; // Rotting green skin
    hctx.fillRect(0, 0, 16, 16);
    // Darker patches
    hctx.fillStyle = '#325428';
    hctx.fillRect(0, 0, 16, 4);
    hctx.fillRect(2, 4, 3, 2);
    hctx.fillRect(11, 4, 3, 2);
    // Sunken Black Eyes
    hctx.fillStyle = '#111e0e';
    hctx.fillRect(3, 7, 3, 2);
    hctx.fillRect(10, 7, 3, 2);
    // Dark mouth
    hctx.fillStyle = '#22381b';
    hctx.fillRect(5, 12, 6, 2);

    const headTex = new THREE.CanvasTexture(headCanvas);
    headTex.magFilter = THREE.NearestFilter;
    headTex.minFilter = THREE.NearestFilter;
    this.headMat = new THREE.MeshStandardMaterial({ map: headTex, roughness: 0.9 });

    const headGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    this.headMesh = new THREE.Mesh(headGeom, this.headMat);
    this.headMesh.position.y = 1.65;
    this.headMesh.castShadow = true;
    this.group.add(this.headMesh);

    // 2. Torso (Cyan Shirt)
    this.shirtMat = new THREE.MeshStandardMaterial({ color: 0x1f8087, roughness: 0.9 });
    const bodyGeom = new THREE.BoxGeometry(0.55, 0.72, 0.3);
    this.bodyMesh = new THREE.Mesh(bodyGeom, this.shirtMat);
    this.bodyMesh.position.y = 1.05;
    this.bodyMesh.castShadow = true;
    this.group.add(this.bodyMesh);

    // 3. Outstretched Arms (Classic Zombie Pose reaching forward)
    this.armMat = new THREE.MeshStandardMaterial({ color: 0x49743c, roughness: 0.9 });
    const armGeom = new THREE.BoxGeometry(0.18, 0.65, 0.18);

    // Left Arm
    this.leftArm = new THREE.Mesh(armGeom, this.armMat);
    this.leftArm.position.set(-0.35, 1.25, 0.28);
    this.leftArm.rotation.x = -Math.PI / 2; // Reaching straight forward
    this.leftArm.castShadow = true;
    this.group.add(this.leftArm);

    // Right Arm
    this.rightArm = new THREE.Mesh(armGeom, this.armMat);
    this.rightArm.position.set(0.35, 1.25, 0.28);
    this.rightArm.rotation.x = -Math.PI / 2; // Reaching straight forward
    this.rightArm.castShadow = true;
    this.group.add(this.rightArm);

    // 4. Legs (Dark Blue Pants)
    this.pantsMat = new THREE.MeshStandardMaterial({ color: 0x24335c, roughness: 0.9 });
    const legGeom = new THREE.BoxGeometry(0.2, 0.65, 0.2);

    this.leftLeg = new THREE.Mesh(legGeom, this.pantsMat);
    this.leftLeg.position.set(-0.13, 0.325, 0);
    this.leftLeg.castShadow = true;
    this.group.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeom, this.pantsMat);
    this.rightLeg.position.set(0.13, 0.325, 0);
    this.rightLeg.castShadow = true;
    this.group.add(this.rightLeg);

    // Store all meshes for damage flash effect
    this.meshParts = [this.headMesh, this.bodyMesh, this.leftArm, this.rightArm, this.leftLeg, this.rightLeg];
  }

  update(delta, player, dayNight) {
    if (this.isDead) return;

    // 1. Damage Flash Timer
    if (this.hitFlashTimer > 0) {
      this.hitFlashTimer -= delta;
      if (this.hitFlashTimer <= 0) {
        this.resetMaterialsColor();
      }
    }

    // 2. Day Burn Check (Catches fire in daylight if uncovered)
    if (dayNight && dayNight.isDay && dayNight.isDay()) {
      const topBlock = this.world.getBlock(Math.floor(this.position.x), Math.floor(this.position.y + 2), Math.floor(this.position.z));
      if (topBlock === BLOCKS.AIR) {
        this.burnTimer += delta;
        if (this.burnTimer >= 1.0) {
          this.burnTimer = 0;
          this.takeDamage(3, null); // Burns from sunlight
        }
      }
    }

    // 3. Ambient Groans
    this.groanTimer -= delta;
    if (this.groanTimer <= 0) {
      this.groanTimer = 10 + Math.random() * 12;
      const dist = this.position.distanceTo(player.position);
      if (dist < 18) {
        this.audioEngine.playSound('zombie');
      }
    }

    if (this.attackCooldown > 0) {
      this.attackCooldown -= delta;
    }

    // 4. AI Navigation & Attack (Only targets survival / hardcore players)
    const canTarget = player.gameMode === 'survival' || player.gameMode === 'hardcore';
    const distToPlayer = this.position.distanceTo(player.position);

    if (canTarget && distToPlayer < 24) {
      // Rotate towards player
      const dx = player.position.x - this.position.x;
      const dz = player.position.z - this.position.z;
      const targetAngle = Math.atan2(dx, dz);
      this.group.rotation.y = targetAngle;

      // Attack if in melee range
      if (distToPlayer < 1.4 && this.attackCooldown <= 0) {
        this.attackCooldown = 1.2;
        const damage = player.gameMode === 'hardcore' ? 5 : 3;
        player.takeDamage(damage);
        // Player knockback
        const pushDir = new THREE.Vector3(dx, 0.4, dz).normalize().multiplyScalar(6);
        player.velocity.add(pushDir);
      } else if (distToPlayer >= 1.2) {
        // Walk towards player with solid block collision
        const moveDir = new THREE.Vector2(dx, dz).normalize();
        this.moveWithCollision(moveDir.x, moveDir.y, delta);
      }
    } else {
      // Idle / slow wandering if player out of range
      this.applyGravity(delta);
    }

    this.group.position.copy(this.position);
  }

  // Solid AABB Movement (CANNOT pass through walls or buildings)
  moveWithCollision(dirX, dirZ, delta) {
    const stepDist = this.speed * delta;

    // Try X Movement
    const nextX = this.position.x + dirX * stepDist;
    if (!this.checkBlockCollision(nextX, this.position.y, this.position.z)) {
      this.position.x = nextX;
    } else if (!this.checkBlockCollision(nextX, this.position.y + 1.05, this.position.z)) {
      // Step up 1 block
      this.position.x = nextX;
      this.position.y += 1.05;
    }

    // Try Z Movement
    const nextZ = this.position.z + dirZ * stepDist;
    if (!this.checkBlockCollision(this.position.x, this.position.y, nextZ)) {
      this.position.z = nextZ;
    } else if (!this.checkBlockCollision(this.position.x, this.position.y + 1.05, nextZ)) {
      // Step up 1 block
      this.position.z = nextZ;
      this.position.y += 1.05;
    }

    // Gravity
    this.applyGravity(delta);

    // Leg swinging animation
    this.walkTimer += delta * 7;
    this.leftLeg.rotation.x = Math.sin(this.walkTimer) * 0.55;
    this.rightLeg.rotation.x = -Math.sin(this.walkTimer) * 0.55;
  }

  applyGravity(delta) {
    if (!this.checkBlockCollision(this.position.x, this.position.y - 0.15, this.position.z)) {
      this.position.y = Math.max(0, this.position.y - 14 * delta);
    }
  }

  // Check collision against solid blocks
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

  takeDamage(amount, knockbackDir = null) {
    if (this.isDead) return;

    this.health -= amount;
    this.audioEngine.playSound('zombie_hurt');

    // Knockback
    if (knockbackDir) {
      const impulse = knockbackDir.clone().normalize().multiplyScalar(0.75);
      const testX = this.position.x + impulse.x;
      const testZ = this.position.z + impulse.z;
      if (!this.checkBlockCollision(testX, this.position.y, testZ)) {
        this.position.x = testX;
        this.position.z = testZ;
      }
    }

    // Flash red
    this.hitFlashTimer = 0.2;
    for (const mesh of this.meshParts) {
      if (mesh.material) {
        mesh.material.color.setHex(0xff3333);
      }
    }

    if (this.health <= 0) {
      this.die();
    }
  }

  resetMaterialsColor() {
    this.headMesh.material.color.setHex(0xffffff);
    this.bodyMesh.material.color.setHex(0xffffff);
    this.leftArm.material.color.setHex(0xffffff);
    this.rightArm.material.color.setHex(0xffffff);
    this.leftLeg.material.color.setHex(0xffffff);
    this.rightLeg.material.color.setHex(0xffffff);
  }

  die() {
    this.isDead = true;
    this.world.scene.remove(this.group);
  }

  // Raycast bounding cylinder test
  checkRayHit(origin, direction, maxDist = 5.0) {
    if (this.isDead) return false;

    const vX = this.position.x - origin.x;
    const vZ = this.position.z - origin.z;
    const dirX = direction.x;
    const dirZ = direction.z;
    const lenSqXZ = dirX * dirX + dirZ * dirZ;

    if (lenSqXZ < 0.0001) {
      const distXZ = Math.sqrt(vX * vX + vZ * vZ);
      return distXZ <= 0.85;
    }

    const t = (vX * dirX + vZ * dirZ) / lenSqXZ;
    if (t < 0 || t > maxDist) return false;

    const hitX = origin.x + t * dirX;
    const hitZ = origin.z + t * dirZ;
    const hitY = origin.y + t * direction.y;

    const dx = hitX - this.position.x;
    const dz = hitZ - this.position.z;
    const horizDistSq = dx * dx + dz * dz;

    if (horizDistSq <= (0.85 * 0.85)) {
      if (hitY >= this.position.y - 0.2 && hitY <= this.position.y + 2.3) {
        return true;
      }
    }

    return false;
  }
}

export class ZombieManager {
  constructor(world, audioEngine) {
    this.world = world;
    this.audioEngine = audioEngine;
    this.zombies = [];
    this.spawnCooldown = 6.0;
  }

  update(delta, player, dayNight) {
    // 1. Night Spawner
    if (dayNight && dayNight.isNight && dayNight.isNight()) {
      this.spawnCooldown -= delta;
      if (this.spawnCooldown <= 0) {
        this.spawnCooldown = 8.0 + Math.random() * 6;
        if (this.zombies.length < 5 && player.gameMode !== 'spectator') {
          this.spawnZombieAroundPlayer(player);
        }
      }
    }

    // 2. Update Active Zombies
    for (let i = this.zombies.length - 1; i >= 0; i--) {
      const z = this.zombies[i];
      z.update(delta, player, dayNight);

      // Despawn if dead or too far
      const dist = z.position.distanceTo(player.position);
      if (z.isDead || dist > 55) {
        if (!z.isDead) z.die();
        this.zombies.splice(i, 1);
      }
    }
  }

  spawnZombieAroundPlayer(player) {
    // Spawn between 14 and 25 blocks away
    const angle = Math.random() * Math.PI * 2;
    const dist = 14 + Math.random() * 11;
    const sx = Math.floor(player.position.x + Math.cos(angle) * dist);
    const sz = Math.floor(player.position.z + Math.sin(angle) * dist);

    const sy = this.world.generator.getHeight(sx, sz) + 1;
    if (sy <= 0 || sy >= 60) return;

    const zombie = new Zombie(sx + 0.5, sy, sz + 0.5, this.world, this.audioEngine);
    this.zombies.push(zombie);
  }

  raycast(origin, direction, maxDist = 5.0) {
    for (const z of this.zombies) {
      if (z.checkRayHit(origin, direction, maxDist)) {
        return z;
      }
    }
    return null;
  }
}
