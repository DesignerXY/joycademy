// NES Classic Rightward-Scrolling Camera
export class Camera {
  constructor(width = 256, height = 240) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = 3300; // Level 1-1 boundary
  }

  update(targetX) {
    // Only scroll right when target moves past screen center
    const targetScreenX = targetX - this.x;
    if (targetScreenX > this.width * 0.45) {
      this.x = Math.max(this.x, targetX - this.width * 0.45);
    }
    // Limit to level bounds
    this.x = Math.max(0, Math.min(this.x, this.maxX - this.width));
  }

  reset() {
    this.x = 0;
    this.y = 0;
  }
}
