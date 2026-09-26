// Mario Input Manager supporting Keyboard and Touch D-pad/Buttons
export class InputManager {
  constructor() {
    this.keys = {
      left: false,
      right: false,
      down: false,
      up: false,
      jump: false,
      run: false,
      superJump: false
    };

    this.jumpPressed = false; // Trigger flag for single press
    this.firePressed = false;
    this.superJumpPressed = false;

    this.initKeyboard();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      // Prevent browser arrow scroll
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = true;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') this.keys.down = true;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') this.keys.up = true;

      if (e.code === 'Space' || e.code === 'KeyZ' || e.code === 'KeyJ') {
        if (!this.keys.jump) this.jumpPressed = true;
        this.keys.jump = true;
      }

      if (e.code === 'KeyX' || e.code === 'KeyK' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        if (!this.keys.run) this.firePressed = true;
        this.keys.run = true;
      }

      if (e.code === 'Digit3' || e.code === 'Numpad3' || e.key === '3') {
        if (!this.keys.superJump) this.superJumpPressed = true;
        this.keys.superJump = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = false;
      if (e.code === 'ArrowDown' || e.code === 'KeyS') this.keys.down = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') this.keys.up = false;

      if (e.code === 'Space' || e.code === 'KeyZ' || e.code === 'KeyJ') {
        this.keys.jump = false;
      }

      if (e.code === 'KeyX' || e.code === 'KeyK' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.keys.run = false;
      }

      if (e.code === 'Digit3' || e.code === 'Numpad3' || e.key === '3') {
        this.keys.superJump = false;
      }
    });
  }

  bindTouchButton(elementId, action) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const press = (e) => {
      e.preventDefault();
      if (action === 'jump' && !this.keys.jump) this.jumpPressed = true;
      if (action === 'run' && !this.keys.run) this.firePressed = true;
      if (action === 'superJump' && !this.keys.superJump) this.superJumpPressed = true;
      this.keys[action] = true;
      el.classList.add('active');
    };

    const release = (e) => {
      e.preventDefault();
      this.keys[action] = false;
      el.classList.remove('active');
    };

    el.addEventListener('touchstart', press, { passive: false });
    el.addEventListener('touchend', release, { passive: false });
    el.addEventListener('mousedown', press);
    el.addEventListener('mouseup', release);
    el.addEventListener('mouseleave', release);
  }

  // Clear single-frame press triggers
  update() {
    this.jumpPressed = false;
    this.firePressed = false;
    this.superJumpPressed = false;
  }
}
