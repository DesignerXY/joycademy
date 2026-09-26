import * as THREE from 'three';
import { BLOCKS, BLOCK_DEFS } from './Blocks.js';

export class PlayerController {
  constructor(camera, domElement, world, audioEngine) {
    this.camera = camera;
    this.domElement = domElement;
    this.world = world;
    this.audioEngine = audioEngine;

    // Player State
    this.position = new THREE.Vector3(0, 32, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');

    this.height = 1.7;
    this.radius = 0.3;
    this.onGround = false;
    this.isFlying = false;
    this.isSprinting = false;
    this.gameMode = 'survival'; // 'survival' or 'creative'

    // Survival Metrics
    this.maxHealth = 20;
    this.health = 20;
    this.maxHunger = 20;
    this.hunger = 20;

    // Target Block Raycast Selection Box
    this.targetBlock = null;
    this.selectionBox = this.createSelectionBox();

    // Input States
    this.keys = {};
    this.mouseLocked = false;

    this.initControls();
  }

  createSelectionBox() {
    const geometry = new THREE.BoxGeometry(1.002, 1.002, 1.002);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const line = new THREE.LineSegments(edges, material);
    line.visible = false;
    this.world.scene.add(line);
    return line;
  }

  initControls() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Toggle Creative Fly
      if (e.code === 'KeyF' && this.gameMode === 'creative') {
        this.isFlying = !this.isFlying;
        this.velocity.set(0, 0, 0);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    document.addEventListener('pointerlockchange', () => {
      this.mouseLocked = document.pointerLockElement === this.domElement;
    });

    this.domElement.addEventListener('mousemove', (e) => {
      if (!this.mouseLocked) return;

      const sensitivity = 0.0022;
      this.rotation.y -= e.movementX * sensitivity;
      this.rotation.x -= e.movementY * sensitivity;

      // Clamp pitch (-89deg to +89deg)
      this.rotation.x = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, this.rotation.x));
    });
  }

  lockMouse() {
    this.domElement.requestPointerLock();
  }

  unlockMouse() {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  }

  update(delta) {
    if (delta > 0.1) delta = 0.1; // Cap max delta to prevent tunneling

    this.handleMovement(delta);
    this.updateTargetBlock();
    this.updateSurvivalState(delta);

    // Sync Camera
    this.camera.rotation.copy(this.rotation);
    this.camera.position.copy(this.position).add(new THREE.Vector3(0, 1.5, 0));
  }

  handleMovement(delta) {
    const moveSpeed = (this.keys['ShiftLeft'] || this.keys['ShiftRight']) ? 8.0 : 4.5;
    const inputVector = new THREE.Vector3(0, 0, 0);

    if (this.keys['KeyW']) inputVector.z -= 1;
    if (this.keys['KeyS']) inputVector.z += 1;
    if (this.keys['KeyA']) inputVector.x -= 1;
    if (this.keys['KeyD']) inputVector.x += 1;

    inputVector.normalize();

    // Rotate input to match player facing direction
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y);

    const moveDir = forward.multiplyScalar(-inputVector.z).add(right.multiplyScalar(inputVector.x)).normalize();

    if (this.gameMode === 'spectator') {
      // Spectator Mode: Full 3D noclip flight through all blocks
      const camLook = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
      const camRight = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
      const camUp = new THREE.Vector3(0, 1, 0);

      const flyDir = new THREE.Vector3();
      if (this.keys['KeyW']) flyDir.add(camLook);
      if (this.keys['KeyS']) flyDir.sub(camLook);
      if (this.keys['KeyD']) flyDir.add(camRight);
      if (this.keys['KeyA']) flyDir.sub(camRight);
      if (this.keys['Space']) flyDir.add(camUp);
      if (this.keys['ShiftLeft'] || this.keys['ShiftRight']) flyDir.sub(camUp);

      if (flyDir.lengthSq() > 0.001) flyDir.normalize();

      const specSpeed = (this.keys['ControlLeft'] || this.keys['ControlRight']) ? 18.0 : 9.0;
      this.velocity.copy(flyDir).multiplyScalar(specSpeed);
      this.position.addScaledVector(this.velocity, delta);
    } else if (this.isFlying) {
      // Creative Flying movement
      this.velocity.x = moveDir.x * moveSpeed * 1.5;
      this.velocity.z = moveDir.z * moveSpeed * 1.5;
      this.velocity.y = 0;

      if (this.keys['Space']) this.velocity.y = moveSpeed;
      if (this.keys['ShiftLeft']) this.velocity.y = -moveSpeed;

      this.position.addScaledVector(this.velocity, delta);
    } else {
      // Normal physics movement with AABB collision (Survival & Hardcore)
      this.velocity.x = moveDir.x * moveSpeed;
      this.velocity.z = moveDir.z * moveSpeed;

      // Gravity
      this.velocity.y -= 24.0 * delta;

      // Jump
      if (this.keys['Space'] && this.onGround) {
        this.velocity.y = 8.5;
        this.onGround = false;
        this.audioEngine.playSound('jump');
      }

      // Steps sound
      if (this.onGround && moveDir.lengthSq() > 0.1 && Math.random() < 0.05) {
        this.audioEngine.playSound('step');
      }

      // Apply velocity and collide
      this.collideAndMove(delta);
    }
  }

  collideAndMove(delta) {
    const nextPos = this.position.clone().addScaledVector(this.velocity, delta);

    // Collision Check X
    let tempPos = new THREE.Vector3(nextPos.x, this.position.y, this.position.z);
    if (!this.checkAABBCollision(tempPos)) {
      this.position.x = tempPos.x;
    } else {
      this.velocity.x = 0;
    }

    // Collision Check Z
    tempPos.set(this.position.x, this.position.y, nextPos.z);
    if (!this.checkAABBCollision(tempPos)) {
      this.position.z = tempPos.z;
    } else {
      this.velocity.z = 0;
    }

    // Collision Check Y
    tempPos.set(this.position.x, nextPos.y, this.position.z);
    if (!this.checkAABBCollision(tempPos)) {
      this.position.y = tempPos.y;
      this.onGround = false;
    } else {
      if (this.velocity.y < 0) {
        this.onGround = true;
        // Fall damage
        if (this.velocity.y < -16 && (this.gameMode === 'survival' || this.gameMode === 'hardcore')) {
          const damage = Math.floor((-this.velocity.y - 16) * 1.5);
          this.takeDamage(damage);
        }
      }
      this.velocity.y = 0;
    }
  }

  checkAABBCollision(pos) {
    const minX = Math.floor(pos.x - this.radius);
    const maxX = Math.floor(pos.x + this.radius);
    const minY = Math.floor(pos.y);
    const maxY = Math.floor(pos.y + this.height);
    const minZ = Math.floor(pos.z - this.radius);
    const maxZ = Math.floor(pos.z + this.radius);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          const blockId = this.world.getBlock(x, y, z);
          const def = BLOCK_DEFS[blockId] || { solid: false };
          if (def.solid) {
            return true;
          }
        }
      }
    }
    return false;
  }

  updateTargetBlock(includeWater = false) {
    if (this.gameMode === 'spectator') {
      this.targetBlock = { hit: false };
      this.selectionBox.visible = false;
      return;
    }

    const cameraDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    const eyePos = this.position.clone().add(new THREE.Vector3(0, 1.5, 0));

    this.targetBlock = this.world.raycastBlock(eyePos, cameraDir, 6, includeWater);

    if (this.targetBlock.hit) {
      this.selectionBox.position.set(
        this.targetBlock.x + 0.5,
        this.targetBlock.y + 0.5,
        this.targetBlock.z + 0.5
      );
      this.selectionBox.visible = true;
    } else {
      this.selectionBox.visible = false;
    }
  }

  updateSurvivalState(delta) {
    if (this.gameMode !== 'survival' && this.gameMode !== 'hardcore') return;

    // Void fall damage
    if (this.position.y < -10) {
      this.takeDamage(5);
      this.position.set(0, 40, 0);
    }
  }

  setGameMode(mode) {
    this.gameMode = mode;
    if (mode === 'spectator') {
      this.isFlying = true;
      this.velocity.set(0, 0, 0);
      this.selectionBox.visible = false;
    } else if (mode === 'creative') {
      this.isFlying = false;
    } else {
      this.isFlying = false;
    }
  }

  takeDamage(amount) {
    if (this.gameMode === 'creative' || this.gameMode === 'spectator') return;

    this.health = Math.max(0, this.health - amount);
    this.audioEngine.playSound('hurt');

    if (this.health <= 0 && this.onDeath) {
      this.onDeath();
    }
  }
}
