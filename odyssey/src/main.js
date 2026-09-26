// Super Mario Odyssey 3D Web Edition
import * as THREE from 'three';

class OdysseyAudio {
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

  playTone(freq, dur, type = 'square', gainVal = 0.15, offset = 0) {
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

  playCapThrow() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playCapJump() {
    if (!this.ctx) return;
    this.playTone(330, 0.1, 'triangle', 0.25, 0);
    this.playTone(493.88, 0.1, 'triangle', 0.25, 0.08);
    this.playTone(659.25, 0.2, 'triangle', 0.25, 0.16);
  }

  playCapture() {
    if (!this.ctx) return;
    this.playTone(523.25, 0.08, 'sine', 0.2, 0);
    this.playTone(659.25, 0.08, 'sine', 0.2, 0.06);
    this.playTone(783.99, 0.15, 'sine', 0.25, 0.12);
  }

  playMoonFanfare() {
    if (!this.ctx) return;
    const notes = [
      { f: 523.25, d: 0.12, o: 0 },
      { f: 659.25, d: 0.12, o: 0.12 },
      { f: 783.99, d: 0.12, o: 0.24 },
      { f: 1046.50, d: 0.4, o: 0.36 }
    ];
    notes.forEach(n => this.playTone(n.f, n.d, 'triangle', 0.3, n.o));
  }

  playCoin() {
    if (!this.ctx) return;
    this.playTone(987.77, 0.08, 'sine', 0.2, 0);
    this.playTone(1318.51, 0.25, 'sine', 0.2, 0.07);
  }
}

class OdysseyApp {
  constructor() {
    this.canvas = document.getElementById('odyssey-canvas');
    if (!this.canvas) return;

    this.audio = new OdysseyAudio();
    this.initThree();
    this.initWorld();
    this.initMario();
    this.initCappy();
    this.initGoombas();
    this.initMoons();
    this.initControls();
    this.initDOM();

    this.moonCount = 0;
    this.coinCount = 0;
    this.health = 3;
    this.isCaptured = false;
    this.capturedEntity = null;

    this.clock = new THREE.Clock();
    this.animate();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c1427);
    this.scene.fog = new THREE.FogExp2(0x0c1427, 0.012);

    this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 5, 12);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambient = new THREE.AmbientLight(0xdbeafe, 0.7);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.2);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    this.scene.add(dirLight);

    // Warm streetlamps / bonfire light
    const pointLight = new THREE.PointLight(0xf59e0b, 1.5, 30);
    pointLight.position.set(0, 6, 0);
    this.scene.add(pointLight);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initWorld() {
    this.solids = [];

    // 1. Central Bonneton Plaza (Paved stone courtyard)
    const plazaGeom = new THREE.CylinderGeometry(18, 19, 2, 32);
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
    const plaza = new THREE.Mesh(plazaGeom, plazaMat);
    plaza.position.y = -1;
    plaza.receiveShadow = true;
    this.scene.add(plaza);
    this.solids.push({ box: new THREE.Box3().setFromObject(plaza), mesh: plaza });

    // 2. Centerpiece: Top Hat Tower (帽子高塔)
    const towerGeom = new THREE.CylinderGeometry(4.5, 4.5, 14, 24);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const tower = new THREE.Mesh(towerGeom, towerMat);
    tower.position.set(0, 6, -6);
    tower.castShadow = true;
    tower.receiveShadow = true;
    this.scene.add(tower);
    this.solids.push({ box: new THREE.Box3().setFromObject(tower), mesh: tower });

    // Hat Brim on Tower
    const brimGeom = new THREE.CylinderGeometry(7.5, 7.5, 0.8, 24);
    const brimMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
    const brim = new THREE.Mesh(brimGeom, brimMat);
    brim.position.set(0, 0.4, -6);
    this.scene.add(brim);

    // Tower Top Platform
    const topPlatformGeom = new THREE.CylinderGeometry(5.2, 5.2, 1, 24);
    const topPlatform = new THREE.Mesh(topPlatformGeom, plazaMat);
    topPlatform.position.set(0, 13.5, -6);
    this.scene.add(topPlatform);
    this.solids.push({ box: new THREE.Box3().setFromObject(topPlatform), mesh: topPlatform });

    // 3. Side Island (Waterfall Cliff)
    const cliffGeom = new THREE.BoxGeometry(10, 8, 10);
    const cliffMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
    const cliff = new THREE.Mesh(cliffGeom, cliffMat);
    cliff.position.set(16, 3, -4);
    cliff.castShadow = true;
    cliff.receiveShadow = true;
    this.scene.add(cliff);
    this.solids.push({ box: new THREE.Box3().setFromObject(cliff), mesh: cliff });

    // 4. Stepping Pillars to Cliff
    [10, 13].forEach((px, i) => {
      const stepGeom = new THREE.CylinderGeometry(1.4, 1.4, 3 + i * 2, 16);
      const step = new THREE.Mesh(stepGeom, towerMat);
      step.position.set(px, (3 + i * 2) / 2 - 1, -4);
      this.scene.add(step);
      this.solids.push({ box: new THREE.Box3().setFromObject(step), mesh: step });
    });

    // 5. The Odyssey Airship (奥德赛号飞船)
    this.initOdysseyShip();
  }

  initOdysseyShip() {
    this.shipGroup = new THREE.Group();
    this.shipGroup.position.set(-14, 0, 4);

    // Red Globe Balloon
    const balloonGeom = new THREE.SphereGeometry(3.5, 24, 24);
    const balloonMat = new THREE.MeshStandardMaterial({ color: 0xd82800, roughness: 0.4 });
    const balloon = new THREE.Mesh(balloonGeom, balloonMat);
    balloon.position.y = 8;
    balloon.scale.set(1, 1.2, 1);
    this.shipGroup.add(balloon);

    // White Trim on Balloon
    const trimGeom = new THREE.TorusGeometry(3.52, 0.15, 16, 32);
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const trim = new THREE.Mesh(trimGeom, trimMat);
    trim.rotation.x = Math.PI / 2;
    trim.position.y = 8;
    this.shipGroup.add(trim);

    // Ship Hull / Cabin
    const hullGeom = new THREE.CylinderGeometry(2.5, 1.8, 2.5, 16);
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.5 });
    const hull = new THREE.Mesh(hullGeom, hullMat);
    hull.position.y = 2;
    this.shipGroup.add(hull);

    // Porthole Windows
    const portGeom = new THREE.SphereGeometry(0.5, 16, 16);
    const portMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2 });
    const port = new THREE.Mesh(portGeom, portMat);
    port.position.set(0, 2.2, 2.3);
    this.shipGroup.add(port);

    // Ropes connecting hull to balloon
    const ropeMat = new THREE.MeshBasicMaterial({ color: 0x78350f });
    [-1.8, 1.8].forEach(rx => {
      [-1.8, 1.8].forEach(rz => {
        const ropeGeom = new THREE.CylinderGeometry(0.04, 0.04, 4);
        const rope = new THREE.Mesh(ropeGeom, ropeMat);
        rope.position.set(rx * 0.8, 5, rz * 0.8);
        this.shipGroup.add(rope);
      });
    });

    this.scene.add(this.shipGroup);
  }

  initMario() {
    this.marioGroup = new THREE.Group();
    this.marioGroup.position.set(0, 0, 8);

    // Head
    const headGeom = new THREE.SphereGeometry(0.42, 16, 16);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfce4a0, roughness: 0.6 });
    this.marioHead = new THREE.Mesh(headGeom, skinMat);
    this.marioHead.position.y = 1.35;
    this.marioGroup.add(this.marioHead);

    // Nose
    const noseGeom = new THREE.SphereGeometry(0.18, 12, 12);
    const nose = new THREE.Mesh(noseGeom, skinMat);
    nose.position.set(0, 1.35, 0.42);
    this.marioGroup.add(nose);

    // Mustache
    const stacheGeom = new THREE.BoxGeometry(0.44, 0.12, 0.16);
    const stacheMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
    const stache = new THREE.Mesh(stacheGeom, stacheMat);
    stache.position.set(0, 1.25, 0.45);
    this.marioGroup.add(stache);

    // Eyes
    const eyeGeom = new THREE.SphereGeometry(0.08, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    [-0.14, 0.14].forEach(ex => {
      const eye = new THREE.Mesh(eyeGeom, eyeMat);
      eye.position.set(ex, 1.42, 0.38);
      this.marioGroup.add(eye);
    });

    // Body (Blue Overalls & Red Shirt)
    const bodyGeom = new THREE.CylinderGeometry(0.38, 0.42, 0.7, 16);
    const overallMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.7 });
    this.marioBody = new THREE.Mesh(bodyGeom, overallMat);
    this.marioBody.position.y = 0.75;
    this.marioGroup.add(this.marioBody);

    // Yellow Buttons
    const btnGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 8);
    const btnMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    [-0.16, 0.16].forEach(bx => {
      const b = new THREE.Mesh(btnGeom, btnMat);
      b.rotation.x = Math.PI / 2;
      b.position.set(bx, 0.92, 0.4);
      this.marioGroup.add(b);
    });

    // Legs & Brown Shoes
    const shoeGeom = new THREE.BoxGeometry(0.24, 0.2, 0.38);
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    this.leftFoot = new THREE.Mesh(shoeGeom, shoeMat);
    this.leftFoot.position.set(-0.22, 0.1, 0.05);
    this.marioGroup.add(this.leftFoot);

    this.rightFoot = new THREE.Mesh(shoeGeom, shoeMat);
    this.rightFoot.position.set(0.22, 0.1, 0.05);
    this.marioGroup.add(this.rightFoot);

    // Arms & White Gloves
    const gloveGeom = new THREE.SphereGeometry(0.16, 12, 12);
    const gloveMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    this.leftHand = new THREE.Mesh(gloveGeom, gloveMat);
    this.leftHand.position.set(-0.55, 0.75, 0);
    this.marioGroup.add(this.leftHand);

    this.rightHand = new THREE.Mesh(gloveGeom, gloveMat);
    this.rightHand.position.set(0.55, 0.75, 0);
    this.marioGroup.add(this.rightHand);

    this.scene.add(this.marioGroup);

    // Physics State
    this.marioPos = this.marioGroup.position;
    this.marioVel = new THREE.Vector3(0, 0, 0);
    this.onGround = true;
    this.runTimer = 0;
  }

  initCappy() {
    // Cappy Hat Group (Red cap with white eyes)
    this.cappy = new THREE.Group();

    const capGeom = new THREE.CylinderGeometry(0.48, 0.52, 0.28, 16);
    const redMat = new THREE.MeshStandardMaterial({ color: 0xd82800, roughness: 0.5 });
    const cap = new THREE.Mesh(capGeom, redMat);
    cap.position.y = 0.14;
    this.cappy.add(cap);

    // Cap Visor
    const visorGeom = new THREE.BoxGeometry(0.56, 0.06, 0.35);
    const visor = new THREE.Mesh(visorGeom, redMat);
    visor.position.set(0, 0.04, 0.36);
    this.cappy.add(visor);

    // Cappy Big Eyes
    const eyeGeom = new THREE.SphereGeometry(0.12, 12, 12);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pupilGeom = new THREE.SphereGeometry(0.06, 8, 8);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });

    [-0.15, 0.15].forEach(ex => {
      const e = new THREE.Mesh(eyeGeom, eyeMat);
      e.position.set(ex, 0.2, 0.44);
      this.cappy.add(e);
      const p = new THREE.Mesh(pupilGeom, pupilMat);
      p.position.set(ex, 0.2, 0.54);
      this.cappy.add(p);
    });

    this.marioGroup.add(this.cappy);
    this.cappy.position.set(0, 1.62, 0);

    // Cappy Throwing State
    this.isCappyThrown = false;
    this.cappyHoverTimer = 0;
    this.cappyTarget = new THREE.Vector3();
    this.cappyVelocity = new THREE.Vector3();
  }

  initGoombas() {
    this.goombas = [];

    const spawnGoomba = (x, z) => {
      const g = new THREE.Group();
      g.position.set(x, 0, z);

      // Head / Body
      const headGeom = new THREE.ConeGeometry(0.55, 0.8, 16);
      const headMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.7 });
      const head = new THREE.Mesh(headGeom, headMat);
      head.position.y = 0.5;
      g.add(head);

      // Feet
      const footGeom = new THREE.SphereGeometry(0.2, 8, 8);
      const footMat = new THREE.MeshStandardMaterial({ color: 0x1c1917 });
      [-0.24, 0.24].forEach(fx => {
        const foot = new THREE.Mesh(footGeom, footMat);
        foot.position.set(fx, 0.1, 0.1);
        foot.scale.set(1, 0.6, 1.4);
        g.add(foot);
      });

      // Eyes
      const eyeGeom = new THREE.BoxGeometry(0.1, 0.22, 0.08);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      [-0.14, 0.14].forEach(ex => {
        const eye = new THREE.Mesh(eyeGeom, eyeMat);
        eye.position.set(ex, 0.48, 0.42);
        g.add(eye);
      });

      this.scene.add(g);
      this.goombas.push({
        group: g,
        dir: new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize(),
        speed: 1.4,
        isCaptured: false
      });
    };

    spawnGoomba(6, 4);
    spawnGoomba(-7, -2);
    spawnGoomba(16, -4);
  }

  initMoons() {
    this.moons = [];

    const createMoon = (x, y, z, name) => {
      const g = new THREE.Group();
      g.position.set(x, y, z);

      // 3D Crescent Moon Geometry
      const shape = new THREE.Shape();
      shape.absarc(0, 0, 1.2, -Math.PI / 2, Math.PI / 2, false);
      shape.absarc(0.4, 0, 1.1, Math.PI / 2, -Math.PI / 2, true);

      const extrudeSettings = { depth: 0.4, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
      const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.6,
        roughness: 0.2
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.y = Math.PI / 2;
      g.add(mesh);

      // Moon eyes
      const eyeGeom = new THREE.BoxGeometry(0.08, 0.28, 0.08);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      [-0.12, 0.12].forEach(ez => {
        const eye = new THREE.Mesh(eyeGeom, eyeMat);
        eye.position.set(0.3, 0.2, ez);
        g.add(eye);
      });

      this.scene.add(g);
      this.moons.push({ group: g, name, collected: false });
    };

    createMoon(0, 15, -6, '高塔顶端的秘密！(Secret of Top Hat Tower)');
    createMoon(16, 8, -4, '悬崖瀑布之月！(Waterfall Cliff Moon)');
    createMoon(-14, 12, 4, '奥德赛号气球之顶！(Odyssey Balloon Top)');
  }

  initControls() {
    this.keys = {};
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Cappy Throw
      if (e.code === 'KeyC') {
        this.throwCappy();
      }

      // Uncapture Goomba
      if (e.code === 'ShiftLeft' && this.isCaptured) {
        this.uncapture();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    window.addEventListener('mousedown', (e) => {
      if (e.button === 2) {
        this.throwCappy();
      }
    });

    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  initDOM() {
    const btnStart = document.getElementById('btn-start-odyssey');
    const overlay = document.getElementById('odyssey-start');
    const btnSound = document.getElementById('btn-sound');

    if (btnStart) {
      btnStart.addEventListener('click', () => {
        this.audio.init();
        if (overlay) overlay.classList.add('hidden');
      });
    }

    if (btnSound) {
      btnSound.addEventListener('click', () => {
        this.audio.init();
        this.audio.isMuted = !this.audio.isMuted;
        btnSound.innerText = this.audio.isMuted ? '🔇 静音' : '🔊 声音';
      });
    }
  }

  throwCappy() {
    if (this.isCappyThrown || this.isCaptured) return;

    this.audio.playCapThrow();
    this.isCappyThrown = true;
    this.cappyHoverTimer = 1.3; // Hovers in air

    // Detach from Mario, add to scene
    this.scene.add(this.cappy);
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.marioGroup.quaternion).normalize();
    this.cappy.position.copy(this.marioPos).add(new THREE.Vector3(0, 1.2, 0));
    this.cappyTarget.copy(this.cappy.position).add(forward.multiplyScalar(6.5));
  }

  uncapture() {
    if (!this.isCaptured) return;
    this.isCaptured = false;
    const banner = document.getElementById('capture-status');
    if (banner) banner.classList.add('hidden');

    this.marioGroup.visible = true;
    this.marioGroup.position.copy(this.capturedEntity.group.position);
    this.marioGroup.position.y += 0.2;
    this.marioVel.y = 5.0; // Pop jump out of Goomba!

    this.marioGroup.add(this.cappy);
    this.cappy.position.set(0, 1.62, 0);

    this.capturedEntity.group.visible = true;
    this.capturedEntity.isCaptured = false;
    this.capturedEntity = null;
    this.audio.playCapJump();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = Math.min(this.clock.getDelta(), 0.05);

    this.updatePlayer(delta);
    this.updateCappy(delta);
    this.updateGoombas(delta);
    this.updateMoons(delta);
    this.updateCamera();

    this.renderer.render(this.scene, this.camera);
  }

  updatePlayer(delta) {
    const targetObj = this.isCaptured ? this.capturedEntity.group : this.marioGroup;

    // Movement Input
    const moveDir = new THREE.Vector3();
    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveDir.z -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveDir.z += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveDir.x -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveDir.x += 1;

    const isMoving = moveDir.lengthSq() > 0;
    if (isMoving) {
      moveDir.normalize();
      const speed = (this.keys['ShiftLeft'] || this.keys['ShiftRight']) ? 9.5 : 5.8;
      targetObj.position.x += moveDir.x * speed * delta;
      targetObj.position.z += moveDir.z * speed * delta;

      // Rotate toward movement direction
      const angle = Math.atan2(moveDir.x, moveDir.z);
      targetObj.rotation.y = angle;

      // Foot shuffle animation
      if (!this.isCaptured) {
        this.runTimer += delta * 14;
        this.leftFoot.position.z = Math.sin(this.runTimer) * 0.25;
        this.rightFoot.position.z = -Math.sin(this.runTimer) * 0.25;
      }
    }

    // Jump Input
    if (this.keys['Space'] && this.onGround) {
      this.marioVel.y = 8.8;
      this.onGround = false;
      this.audio.playTone(392, 0.15, 'triangle', 0.2);
    }

    // Gravity
    this.marioVel.y -= 22 * delta;
    targetObj.position.y += this.marioVel.y * delta;

    // Ground and Platform Collision
    let landed = false;
    const playerBox = new THREE.Box3().setFromCenterAndSize(targetObj.position, new THREE.Vector3(1, 1.8, 1));

    for (const solid of this.solids) {
      if (playerBox.intersectsBox(solid.box)) {
        if (targetObj.position.y >= solid.box.max.y - 0.5 && this.marioVel.y <= 0) {
          targetObj.position.y = solid.box.max.y;
          this.marioVel.y = 0;
          this.onGround = true;
          landed = true;
          break;
        }
      }
    }

    // Floor limit
    if (targetObj.position.y <= 0) {
      targetObj.position.y = 0;
      this.marioVel.y = 0;
      this.onGround = true;
      landed = true;
    }
    if (!landed) this.onGround = false;

    // Check Falling off World Reset
    if (targetObj.position.y < -15) {
      targetObj.position.set(0, 5, 8);
      this.marioVel.set(0, 0, 0);
    }
  }

  updateCappy(delta) {
    if (!this.isCappyThrown) return;

    // Spin Cappy
    this.cappy.rotation.y += delta * 30;

    if (this.cappyHoverTimer > 0) {
      this.cappyHoverTimer -= delta;
      this.cappy.position.lerp(this.cappyTarget, delta * 8);

      // 1. Check Cap Jump (Mario leaps onto hovering Cappy!)
      const distToMario = this.cappy.position.distanceTo(this.marioPos);
      if (distToMario < 1.4 && this.marioVel.y < 0) {
        // TRIGGER SUPER CAP JUMP!
        this.marioVel.y = 11.5;
        this.audio.playCapJump();
        this.cappyHoverTimer = 0; // Return immediately
      }

      // 2. Check Capture (Cappy hits a Goomba!)
      for (const g of this.goombas) {
        if (!g.isCaptured && this.cappy.position.distanceTo(g.group.position) < 1.3) {
          this.captureGoomba(g);
          return;
        }
      }
    } else {
      // Return to Mario's Head
      const headPos = this.marioPos.clone().add(new THREE.Vector3(0, 1.62, 0));
      this.cappy.position.lerp(headPos, delta * 12);

      if (this.cappy.position.distanceTo(headPos) < 0.3) {
        this.isCappyThrown = false;
        this.marioGroup.add(this.cappy);
        this.cappy.position.set(0, 1.62, 0);
        this.cappy.rotation.set(0, 0, 0);
      }
    }
  }

  captureGoomba(goomba) {
    this.audio.playCapture();
    this.isCaptured = true;
    this.capturedEntity = goomba;
    goomba.isCaptured = true;

    // Mario disappears, Cappy sits on Goomba
    this.marioGroup.visible = false;
    this.scene.remove(this.cappy);
    goomba.group.add(this.cappy);
    this.cappy.position.set(0, 0.9, 0);
    this.isCappyThrown = false;

    const banner = document.getElementById('capture-status');
    if (banner) banner.classList.remove('hidden');
  }

  updateGoombas(delta) {
    for (const g of this.goombas) {
      if (g.isCaptured) continue;
      g.group.position.addScaledVector(g.dir, g.speed * delta);
      if (g.group.position.length() > 16) {
        g.dir.negate();
      }
    }
  }

  updateMoons(delta) {
    const activeTarget = this.isCaptured ? this.capturedEntity.group.position : this.marioPos;

    for (const m of this.moons) {
      if (m.collected) continue;
      m.group.rotation.y += delta * 2.5;

      if (m.group.position.distanceTo(activeTarget) < 1.8) {
        m.collected = true;
        this.scene.remove(m.group);
        this.moonCount++;

        const countEl = document.getElementById('moon-count');
        if (countEl) countEl.innerText = this.moonCount;

        this.audio.playMoonFanfare();

        // Show got moon modal
        const modal = document.getElementById('moon-banner');
        const moonName = document.getElementById('moon-name');
        if (moonName) moonName.innerText = m.name;
        if (modal) {
          modal.classList.remove('hidden');
          setTimeout(() => {
            modal.classList.add('hidden');
          }, 3200);
        }
      }
    }
  }

  updateCamera() {
    const targetObj = this.isCaptured ? this.capturedEntity.group : this.marioGroup;
    const targetPos = targetObj.position.clone().add(new THREE.Vector3(0, 2.5, 0));
    const idealOffset = new THREE.Vector3(0, 4, 8);
    const idealPos = targetPos.clone().add(idealOffset);

    this.camera.position.lerp(idealPos, 0.08);
    this.camera.lookAt(targetPos);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new OdysseyApp();
});
