import * as THREE from 'three';

export class DayNightCycle {
  constructor(scene) {
    this.scene = scene;

    this.time = 0.25; // 0 = Midnight, 0.25 = Dawn/Morning, 0.5 = Noon, 0.75 = Dusk
    this.dayDuration = 300; // 5 minutes per full cycle
    this.isPaused = false;

    // Sun & Moon Mesh/Light
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 150;
    this.scene.add(this.dirLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambientLight);

    // Weather Particles (Rain)
    this.isRaining = false;
    this.rainParticles = this.createRainSystem();
    this.scene.add(this.rainParticles);
  }

  createRainSystem() {
    const count = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = Math.random() * 40;
      positions[i + 2] = (Math.random() - 0.5) * 80;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xaaaaee,
      size: 0.25,
      transparent: true,
      opacity: 0.6
    });

    const points = new THREE.Points(geometry, material);
    points.visible = false;
    return points;
  }

  toggleWeather() {
    this.isRaining = !this.isRaining;
    this.rainParticles.visible = this.isRaining;
  }

  update(delta, playerPos) {
    if (!this.isPaused) {
      this.time = (this.time + delta / this.dayDuration) % 1.0;
    }

    // Solar angle in radians
    const angle = this.time * Math.PI * 2;
    const distance = 80;

    const sunX = Math.cos(angle) * distance;
    const sunY = Math.sin(angle) * distance;

    this.dirLight.position.set(playerPos.x + sunX, playerPos.y + sunY, playerPos.z + 30);

    // Calculate sky colors and light intensities
    const sunHeight = Math.sin(angle); // -1 (midnight) to +1 (noon)

    let skyColor = new THREE.Color();
    let ambientIntensity = 0.4;
    let dirIntensity = 1.0;

    if (sunHeight > 0.2) {
      // Day time
      skyColor.setHSL(0.58, 0.6, 0.65);
      ambientIntensity = 0.5;
      dirIntensity = 1.2;
    } else if (sunHeight > -0.2) {
      // Dawn / Dusk
      const t = (sunHeight + 0.2) / 0.4;
      skyColor.setHSL(0.08, 0.8, 0.4 + t * 0.25);
      ambientIntensity = 0.3;
      dirIntensity = 0.6;
    } else {
      // Night time
      skyColor.setHSL(0.65, 0.7, 0.06);
      ambientIntensity = 0.15;
      dirIntensity = 0.2;
    }

    this.scene.background = skyColor;
    if (this.scene.fog) {
      this.scene.fog.color = skyColor;
    }

    this.ambientLight.intensity = ambientIntensity;
    this.dirLight.intensity = dirIntensity;

    // Rain follow player & animate
    if (this.isRaining) {
      const positions = this.rainParticles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 35 * delta;
        if (positions[i] < 0) positions[i] = 40;
      }
      this.rainParticles.geometry.attributes.position.needsUpdate = true;
      this.rainParticles.position.set(playerPos.x, playerPos.y, playerPos.z);
    }
  }
}
