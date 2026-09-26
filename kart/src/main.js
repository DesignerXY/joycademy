// Mario Kart 8 Deluxe 3D Split-Screen Engine
import * as THREE from 'three';

class KartAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  playTone(freq, dur, type = 'square', gainVal = 0.1, offset = 0) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime + offset;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + dur);
  }

  playBoost() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.35);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  playItemGet() {
    if (!this.ctx) return;
    this.playTone(523.25, 0.08, 'sine', 0.2, 0);
    this.playTone(659.25, 0.08, 'sine', 0.2, 0.08);
    this.playTone(783.99, 0.15, 'sine', 0.25, 0.16);
  }

  playHit() {
    if (!this.ctx) return;
    this.playTone(120, 0.25, 'sawtooth', 0.3);
  }

  playWinFanfare() {
    if (!this.ctx) return;
    const notes = [440, 554, 659, 880];
    notes.forEach((f, i) => this.playTone(f, 0.15, 'triangle', 0.25, i * 0.12));
  }
}

class MarioKartApp {
  constructor() {
    this.canvasP1 = document.getElementById('canvas-p1');
    this.canvasP2 = document.getElementById('canvas-p2');
    if (!this.canvasP1 || !this.canvasP2) return;

    this.audio = new KartAudio();

    // 1. Setup Shared 3D Scene
    this.initScene();
    this.initTrack();
    this.initItemBoxes();

    // 2. Setup Players
    this.p1 = this.createPlayer('1P', 0xd82800, -2.5, 0); // Mario Red
    this.p2 = this.createPlayer('2P', 0x16a34a, 2.5, 0);  // Luigi Green

    // 3. Renderers and Cameras for Split-Screen
    this.initRenderers();
    this.initControls();
    this.initDOM();

    this.itemsInWorld = [];
    this.isRaceOver = false;

    this.clock = new THREE.Clock();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x38bdf8); // Sky blue
    this.scene.fog = new THREE.FogExp2(0x38bdf8, 0.008);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfffbeb, 1.3);
    sun.position.set(40, 60, 30);
    sun.castShadow = true;
    this.scene.add(sun);
  }

  initTrack() {
    // 1. Green Infield & Grass Ground
    const groundGeom = new THREE.PlaneGeometry(300, 300);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    this.scene.add(ground);

    // 2. Curving Oval Asphalt Racetrack
    // Radius X: 55, Radius Z: 35
    const trackShape = new THREE.Shape();
    const trackWidth = 14;

    const trackGeom = new THREE.RingGeometry(28, 48, 64);
    const trackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const track = new THREE.Mesh(trackGeom, trackMat);
    track.rotation.x = -Math.PI / 2;
    track.scale.set(1.5, 1.0, 1.0);
    this.scene.add(track);

    // 3. Red & White Curbs
    const curbGeom = new THREE.RingGeometry(26.5, 28, 64);
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xd82800, roughness: 0.5 });
    const curb = new THREE.Mesh(curbGeom, curbMat);
    curb.rotation.x = -Math.PI / 2;
    curb.scale.set(1.5, 1.0, 1.0);
    this.scene.add(curb);

    // 4. Start / Finish Line Banner
    const bannerGroup = new THREE.Group();
    bannerGroup.position.set(0, 0, 38);

    const postGeom = new THREE.CylinderGeometry(0.3, 0.3, 8);
    const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    [-12, 12].forEach(px => {
      const p = new THREE.Mesh(postGeom, postMat);
      p.position.set(px, 4, 0);
      bannerGroup.add(p);
    });

    // Checkered Arch
    const archGeom = new THREE.BoxGeometry(24, 2, 0.5);
    const archMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const arch = new THREE.Mesh(archGeom, archMat);
    arch.position.set(0, 7.5, 0);
    bannerGroup.add(arch);

    this.scene.add(bannerGroup);
  }

  initItemBoxes() {
    this.itemBoxes = [];
    const positions = [
      { x: 0, z: -38 },
      { x: -50, z: 0 },
      { x: 50, z: 0 },
      { x: -25, z: 32 },
      { x: 25, z: -32 }
    ];

    positions.forEach(pos => {
      const g = new THREE.Group();
      g.position.set(pos.x, 1.4, pos.z);

      // Rainbow question box
      const boxGeom = new THREE.BoxGeometry(1.6, 1.6, 1.6);
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        transparent: true,
        opacity: 0.85,
        roughness: 0.1
      });
      const box = new THREE.Mesh(boxGeom, boxMat);
      g.add(box);

      this.scene.add(g);
      this.itemBoxes.push({ group: g, active: true, respawnTimer: 0 });
    });
  }

  createPlayer(name, colorHex, startX, startZ) {
    const kartGroup = new THREE.Group();
    kartGroup.position.set(startX, 0.3, 38);

    // Kart Chassis
    const chassisGeom = new THREE.BoxGeometry(1.8, 0.5, 3.2);
    const chassisMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.4 });
    const chassis = new THREE.Mesh(chassisGeom, chassisMat);
    chassis.position.y = 0.4;
    kartGroup.add(chassis);

    // Front Bumper
    const bumperGeom = new THREE.BoxGeometry(2.1, 0.3, 0.6);
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const bumper = new THREE.Mesh(bumperGeom, bumperMat);
    bumper.position.set(0, 0.3, 1.7);
    kartGroup.add(bumper);

    // 4 Wheels
    const wheelGeom = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
    const wheels = [];

    [[-1.05, 1.1], [1.05, 1.1], [-1.05, -1.1], [1.05, -1.1]].forEach(pos => {
      const w = new THREE.Mesh(wheelGeom, wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(pos[0], 0.25, pos[1]);
      kartGroup.add(w);
      wheels.push(w);
    });

    // Driver Character (Mario / Luigi Head & Cap)
    const driverGroup = new THREE.Group();
    driverGroup.position.set(0, 0.9, -0.2);

    const capGeom = new THREE.CylinderGeometry(0.42, 0.48, 0.35, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: colorHex });
    const cap = new THREE.Mesh(capGeom, capMat);
    cap.position.y = 0.4;
    driverGroup.add(cap);

    const headGeom = new THREE.SphereGeometry(0.38, 16, 16);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfce4a0 });
    const head = new THREE.Mesh(headGeom, skinMat);
    driverGroup.add(head);

    kartGroup.add(driverGroup);
    this.scene.add(kartGroup);

    return {
      name,
      group: kartGroup,
      wheels,
      speed: 0,
      angle: -Math.PI / 2, // Facing counter-clockwise along track
      maxSpeed: 28,
      accel: 18,
      boostTimer: 0,
      spinTimer: 0,
      item: null, // 'MUSHROOM', 'BANANA', 'SHELL'
      lap: 1,
      lastCheckAngle: -Math.PI / 2,
      hudSpeed: document.getElementById(name === '1P' ? 'p1-speed' : 'p2-speed'),
      hudLap: document.getElementById(name === '1P' ? 'p1-lap' : 'p2-lap'),
      hudItem: document.getElementById(name === '1P' ? 'p1-item-icon' : 'p2-item-icon')
    };
  }

  initRenderers() {
    // Player 1 Camera and Renderer
    this.camP1 = new THREE.PerspectiveCamera(65, this.canvasP1.clientWidth / this.canvasP1.clientHeight, 0.1, 500);
    this.rendP1 = new THREE.WebGLRenderer({ canvas: this.canvasP1, antialias: true });
    this.rendP1.setSize(this.canvasP1.clientWidth, this.canvasP1.clientHeight);

    // Player 2 Camera and Renderer
    this.camP2 = new THREE.PerspectiveCamera(65, this.canvasP2.clientWidth / this.canvasP2.clientHeight, 0.1, 500);
    this.rendP2 = new THREE.WebGLRenderer({ canvas: this.canvasP2, antialias: true });
    this.rendP2.setSize(this.canvasP2.clientWidth, this.canvasP2.clientHeight);

    window.addEventListener('resize', () => {
      this.camP1.aspect = this.canvasP1.clientWidth / this.canvasP1.clientHeight;
      this.camP1.updateProjectionMatrix();
      this.rendP1.setSize(this.canvasP1.clientWidth, this.canvasP1.clientHeight);

      this.camP2.aspect = this.canvasP2.clientWidth / this.canvasP2.clientHeight;
      this.camP2.updateProjectionMatrix();
      this.rendP2.setSize(this.canvasP2.clientWidth, this.canvasP2.clientHeight);
    });
  }

  initControls() {
    this.keys = {};
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // 1P Use Item (Space)
      if (e.code === 'Space') {
        this.useItem(this.p1);
      }

      // 2P Use Item (Enter)
      if (e.code === 'Enter') {
        this.useItem(this.p2);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  initDOM() {
    const btnSound = document.getElementById('btn-sound');
    const btnRestart = document.getElementById('btn-restart');

    if (btnSound) {
      btnSound.addEventListener('click', () => {
        this.audio.init();
        this.audio.isMuted = !this.audio.isMuted;
        btnSound.innerText = this.audio.isMuted ? '🔇 静音' : '🔊 声音';
      });
    }

    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        location.reload();
      });
    }
  }

  useItem(player) {
    if (!player.item) return;

    if (player.item === 'MUSHROOM') {
      player.boostTimer = 2.5;
      player.speed += 18;
      this.audio.playBoost();
    } else if (player.item === 'BANANA') {
      // Drop banana behind kart
      const backDir = new THREE.Vector3(0, 0, -2.5).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.angle);
      const bPos = player.group.position.clone().add(backDir);
      this.spawnBanana(bPos);
      this.audio.playTone(440, 0.1, 'sine', 0.2);
    } else if (player.item === 'SHELL') {
      // Shoot forward shell
      const fwdDir = new THREE.Vector3(0, 0, 3.5).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.angle);
      const sPos = player.group.position.clone().add(fwdDir);
      this.spawnShell(sPos, fwdDir.clone().normalize());
      this.audio.playTone(600, 0.1, 'triangle', 0.2);
    }

    player.item = null;
    player.hudItem.innerText = '--';
  }

  spawnBanana(pos) {
    const geom = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8);
    const mat = new THREE.MeshStandardMaterial({ color: 0xfacc15 });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(pos);
    mesh.position.y = 0.4;
    this.scene.add(mesh);
    this.itemsInWorld.push({ type: 'banana', mesh, active: true });
  }

  spawnShell(pos, dir) {
    const geom = new THREE.SphereGeometry(0.5, 12, 12);
    const mat = new THREE.MeshStandardMaterial({ color: 0x16a34a });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(pos);
    mesh.position.y = 0.5;
    this.scene.add(mesh);
    this.itemsInWorld.push({ type: 'shell', mesh, dir, speed: 45, life: 6.0, active: true });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = Math.min(this.clock.getDelta(), 0.05);

    this.updatePlayer1(delta);
    this.updatePlayer2(delta);
    this.updateItemBoxes(delta);
    this.updateWorldItems(delta);
    this.updateCameras();

    // Render Split-screen views
    this.rendP1.render(this.scene, this.camP1);
    this.rendP2.render(this.scene, this.camP2);
  }

  updatePlayer1(delta) {
    this.updateKartPhysics(this.p1, delta, {
      accel: this.keys['KeyW'],
      brake: this.keys['KeyS'],
      left: this.keys['KeyA'],
      right: this.keys['KeyD']
    });
  }

  updatePlayer2(delta) {
    this.updateKartPhysics(this.p2, delta, {
      accel: this.keys['ArrowUp'],
      brake: this.keys['ArrowDown'],
      left: this.keys['ArrowLeft'],
      right: this.keys['ArrowRight']
    });
  }

  updateKartPhysics(player, delta, input) {
    if (this.isRaceOver) return;

    if (player.spinTimer > 0) {
      player.spinTimer -= delta;
      player.angle += delta * 15;
      player.group.rotation.y = player.angle;
      player.speed = Math.max(0, player.speed - 25 * delta);
      return;
    }

    // Boost timer
    const currentMaxSpeed = player.boostTimer > 0 ? player.maxSpeed * 1.5 : player.maxSpeed;
    if (player.boostTimer > 0) player.boostTimer -= delta;

    // Acceleration & Braking
    if (input.accel) {
      player.speed = Math.min(currentMaxSpeed, player.speed + player.accel * delta);
    } else if (input.brake) {
      player.speed = Math.max(-8, player.speed - 30 * delta);
    } else {
      player.speed = Math.max(0, player.speed - 10 * delta);
    }

    // Steering
    if (input.left) player.angle += delta * 2.8;
    if (input.right) player.angle -= delta * 2.8;

    player.group.rotation.y = player.angle;

    // Move Forward
    const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), player.angle);
    player.group.position.addScaledVector(forward, player.speed * delta);

    // Spin wheels
    player.wheels.forEach(w => w.rotation.x += player.speed * delta * 2);

    // Update HUD Speedometer
    player.hudSpeed.innerText = Math.round(player.speed * 4);

    // Check Lap Crossing
    const currentAngle = Math.atan2(player.group.position.z, player.group.position.x);
    if (player.lastCheckAngle < 0 && currentAngle >= 0 && Math.abs(player.group.position.x) < 20 && player.group.position.z > 30) {
      player.lap++;
      player.hudLap.innerText = Math.min(3, player.lap);
      if (player.lap > 3 && !this.isRaceOver) {
        this.triggerWin(player);
      }
    }
    player.lastCheckAngle = currentAngle;
  }

  updateItemBoxes(delta) {
    this.itemBoxes.forEach(ib => {
      ib.group.rotation.y += delta * 3;
      ib.group.rotation.x = Math.sin(performance.now() / 300) * 0.2;

      if (!ib.active) {
        ib.respawnTimer -= delta;
        if (ib.respawnTimer <= 0) {
          ib.active = true;
          ib.group.visible = true;
        }
        return;
      }

      [this.p1, this.p2].forEach(p => {
        if (p.group.position.distanceTo(ib.group.position) < 2.5) {
          ib.active = false;
          ib.group.visible = false;
          ib.respawnTimer = 5.0;

          // Assign random item
          const items = ['MUSHROOM', 'BANANA', 'SHELL'];
          const itemIcons = { MUSHROOM: '🍄', BANANA: '🍌', SHELL: '🐢' };
          p.item = items[Math.floor(Math.random() * items.length)];
          p.hudItem.innerText = itemIcons[p.item];
          this.audio.playItemGet();
        }
      });
    });
  }

  updateWorldItems(delta) {
    for (let i = this.itemsInWorld.length - 1; i >= 0; i--) {
      const item = this.itemsInWorld[i];
      if (!item.active) continue;

      if (item.type === 'shell') {
        item.mesh.position.addScaledVector(item.dir, item.speed * delta);
        item.life -= delta;
        if (item.life <= 0) {
          this.scene.remove(item.mesh);
          this.itemsInWorld.splice(i, 1);
          continue;
        }
      }

      // Check collision with karts
      [this.p1, this.p2].forEach(p => {
        if (p.group.position.distanceTo(item.mesh.position) < 2.0) {
          // Kart hit! Spin 360
          p.spinTimer = 1.0;
          this.audio.playHit();
          this.scene.remove(item.mesh);
          item.active = false;
        }
      });
    }
  }

  updateCameras() {
    // Cam P1 follows P1
    const p1Back = new THREE.Vector3(0, 3.2, -6.5).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.p1.angle);
    this.camP1.position.copy(this.p1.group.position).add(p1Back);
    this.camP1.lookAt(this.p1.group.position.clone().add(new THREE.Vector3(0, 1.2, 0)));

    // Cam P2 follows P2
    const p2Back = new THREE.Vector3(0, 3.2, -6.5).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.p2.angle);
    this.camP2.position.copy(this.p2.group.position).add(p2Back);
    this.camP2.lookAt(this.p2.group.position.clone().add(new THREE.Vector3(0, 1.2, 0)));
  }

  triggerWin(player) {
    this.isRaceOver = true;
    this.audio.playWinFanfare();

    const modal = document.getElementById('winner-modal');
    const title = document.getElementById('winner-title');
    if (title) title.innerText = `${player.name} 拔得头筹，荣获冠军！🏆`;
    if (modal) modal.classList.remove('hidden');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new MarioKartApp();
});
