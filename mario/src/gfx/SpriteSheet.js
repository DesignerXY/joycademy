// High-fidelity procedural NES 1985 Super Mario Bros. Pixel Sprite Sheet
export class SpriteSheet {
  constructor() {
    this.sprites = new Map();
    this.tileSize = 16;
    this.initAllSprites();
  }

  createCanvas(w = 16, h = 16) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { canvas, ctx };
  }

  initAllSprites() {
    this.initTiles();
    this.initMario();
    this.initEnemies();
    this.initItems();
  }

  initTiles() {
    // 1. Ground Block
    const { canvas: groundCanvas, ctx: gctx } = this.createCanvas(16, 16);
    gctx.fillStyle = '#b84418'; // Brick red base
    gctx.fillRect(0, 0, 16, 16);
    gctx.fillStyle = '#fc9838'; // Orange highlight
    gctx.fillRect(0, 0, 16, 2);
    gctx.fillRect(0, 0, 2, 16);
    gctx.fillStyle = '#401808'; // Dark shadow lines
    gctx.fillRect(14, 0, 2, 16);
    gctx.fillRect(0, 14, 16, 2);
    gctx.fillStyle = '#000000';
    gctx.fillRect(3, 4, 3, 3);
    gctx.fillRect(10, 8, 3, 3);
    this.sprites.set('ground', groundCanvas);

    // 2. Brick Block
    const { canvas: brickCanvas, ctx: bctx } = this.createCanvas(16, 16);
    bctx.fillStyle = '#000000';
    bctx.fillRect(0, 0, 16, 16);
    bctx.fillStyle = '#b84418';
    // Top row bricks
    bctx.fillRect(1, 1, 6, 6);
    bctx.fillRect(9, 1, 6, 6);
    // Bottom row bricks (offset)
    bctx.fillRect(1, 9, 2, 6);
    bctx.fillRect(5, 9, 6, 6);
    bctx.fillRect(13, 9, 2, 6);
    // Highlights
    bctx.fillStyle = '#fc9838';
    bctx.fillRect(1, 1, 6, 1);
    bctx.fillRect(9, 1, 6, 1);
    bctx.fillRect(1, 9, 2, 1);
    bctx.fillRect(5, 9, 6, 1);
    bctx.fillRect(13, 9, 2, 1);
    this.sprites.set('brick', brickCanvas);

    // 3. Question Block (Frame 1 - 4)
    for (let f = 0; f < 4; f++) {
      const { canvas: qCanvas, ctx: qctx } = this.createCanvas(16, 16);
      qctx.fillStyle = '#000000';
      qctx.fillRect(0, 0, 16, 16);
      qctx.fillStyle = f === 3 ? '#fc9838' : '#e45c10';
      qctx.fillRect(1, 1, 14, 14);
      qctx.fillStyle = '#fc9838';
      qctx.fillRect(2, 2, 12, 12);

      // Question Mark '?'
      qctx.fillStyle = f === 3 ? '#804000' : '#401808';
      // ? Top curve
      qctx.fillRect(5, 3, 6, 2);
      qctx.fillRect(4, 5, 2, 2);
      qctx.fillRect(10, 5, 2, 3);
      qctx.fillRect(8, 7, 3, 2);
      qctx.fillRect(7, 9, 2, 2);
      // ? Dot
      qctx.fillRect(7, 12, 2, 2);

      // 4 corner bolts
      qctx.fillStyle = '#000000';
      qctx.fillRect(2, 2, 1, 1);
      qctx.fillRect(13, 2, 1, 1);
      qctx.fillRect(2, 13, 1, 1);
      qctx.fillRect(13, 13, 1, 1);

      this.sprites.set(`qblock_${f}`, qCanvas);
    }

    // 4. Empty Hit Block (Iron Gray)
    const { canvas: hitCanvas, ctx: hctx } = this.createCanvas(16, 16);
    hctx.fillStyle = '#000000';
    hctx.fillRect(0, 0, 16, 16);
    hctx.fillStyle = '#9c9c9c';
    hctx.fillRect(1, 1, 14, 14);
    hctx.fillStyle = '#747474';
    hctx.fillRect(2, 2, 12, 12);
    hctx.fillStyle = '#000000';
    hctx.fillRect(2, 2, 2, 2);
    hctx.fillRect(12, 2, 2, 2);
    hctx.fillRect(2, 12, 2, 2);
    hctx.fillRect(12, 12, 2, 2);
    this.sprites.set('empty_block', hitCanvas);

    // 5. Hard Block (Solid Pyramid Stone)
    const { canvas: hardCanvas, ctx: hdctx } = this.createCanvas(16, 16);
    hdctx.fillStyle = '#000000';
    hdctx.fillRect(0, 0, 16, 16);
    hdctx.fillStyle = '#fc9838';
    hdctx.fillRect(1, 1, 14, 14);
    hdctx.fillStyle = '#b84418';
    hdctx.fillRect(3, 3, 10, 10);
    hdctx.fillStyle = '#401808';
    hdctx.fillRect(5, 5, 6, 6);
    this.sprites.set('hard_block', hardCanvas);

    // 6. Pipes (Top-Left, Top-Right, Shaft-Left, Shaft-Right)
    const createPipePart = (type) => {
      const { canvas, ctx } = this.createCanvas(16, 16);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 16, 16);

      if (type === 'top_left') {
        ctx.fillStyle = '#00a800';
        ctx.fillRect(1, 1, 15, 14);
        ctx.fillStyle = '#80d010';
        ctx.fillRect(3, 2, 3, 13);
        ctx.fillStyle = '#005000';
        ctx.fillRect(1, 14, 15, 1);
      } else if (type === 'top_right') {
        ctx.fillStyle = '#00a800';
        ctx.fillRect(0, 1, 15, 14);
        ctx.fillStyle = '#005000';
        ctx.fillRect(9, 2, 5, 13);
        ctx.fillRect(0, 14, 15, 1);
      } else if (type === 'shaft_left') {
        ctx.fillStyle = '#00a800';
        ctx.fillRect(3, 0, 13, 16);
        ctx.fillStyle = '#80d010';
        ctx.fillRect(5, 0, 3, 16);
        ctx.fillStyle = '#000000';
        ctx.fillRect(2, 0, 1, 16);
      } else if (type === 'shaft_right') {
        ctx.fillStyle = '#00a800';
        ctx.fillRect(0, 0, 13, 16);
        ctx.fillStyle = '#005000';
        ctx.fillRect(7, 0, 5, 16);
        ctx.fillStyle = '#000000';
        ctx.fillRect(13, 0, 1, 16);
      }
      return canvas;
    };

    this.sprites.set('pipe_tl', createPipePart('top_left'));
    this.sprites.set('pipe_tr', createPipePart('top_right'));
    this.sprites.set('pipe_sl', createPipePart('shaft_left'));
    this.sprites.set('pipe_sr', createPipePart('shaft_right'));

    // 7. Flagpole & Castle
    const { canvas: poleCanvas, ctx: pctx } = this.createCanvas(16, 16);
    pctx.fillStyle = '#00a800';
    pctx.fillRect(7, 0, 2, 16);
    pctx.fillStyle = '#80d010';
    pctx.fillRect(7, 0, 1, 16);
    this.sprites.set('flagpole', poleCanvas);

    const { canvas: ballCanvas, ctx: blctx } = this.createCanvas(16, 16);
    blctx.fillStyle = '#00a800';
    blctx.fillRect(5, 5, 6, 6);
    blctx.fillStyle = '#80d010';
    blctx.fillRect(6, 6, 3, 3);
    this.sprites.set('pole_top', ballCanvas);

    const { canvas: flagCanvas, ctx: flctx } = this.createCanvas(16, 16);
    flctx.fillStyle = '#00a800';
    flctx.fillRect(0, 2, 16, 12);
    flctx.fillStyle = '#ffffff';
    flctx.fillRect(4, 5, 8, 6);
    flctx.fillStyle = '#00a800';
    flctx.fillRect(6, 6, 4, 4);
    this.sprites.set('flag', flagCanvas);

    // Castle Bricks
    const { canvas: castleCanvas, ctx: cctx } = this.createCanvas(16, 16);
    cctx.fillStyle = '#000000';
    cctx.fillRect(0, 0, 16, 16);
    cctx.fillStyle = '#409050';
    cctx.fillRect(1, 1, 14, 14);
    cctx.fillStyle = '#70c080';
    cctx.fillRect(2, 2, 6, 5);
    cctx.fillRect(9, 8, 5, 5);
    this.sprites.set('castle_brick', castleCanvas);
  }

  initMario() {
    // Colors: NES Palette
    const RED = '#b82400';
    const BROWN = '#8c5400';
    const SKIN = '#fc9838';
    const WHITE = '#ffffff';
    const BLUE = '#2038ec';

    // 1. Small Mario Idle (16x16)
    const { canvas: sIdle, ctx: ictx } = this.createCanvas(16, 16);
    // Hat
    ictx.fillStyle = RED;
    ictx.fillRect(5, 1, 6, 1);
    ictx.fillRect(4, 2, 10, 1);
    // Face & Hair
    ictx.fillStyle = BROWN;
    ictx.fillRect(3, 3, 3, 2);
    ictx.fillRect(2, 4, 1, 3);
    ictx.fillStyle = SKIN;
    ictx.fillRect(6, 3, 6, 3);
    ictx.fillStyle = BROWN;
    ictx.fillRect(9, 3, 1, 2); // Eye
    ictx.fillRect(8, 5, 4, 1); // Moustache
    // Shirt & Overalls
    ictx.fillStyle = RED;
    ictx.fillRect(4, 6, 8, 4);
    ictx.fillStyle = BROWN;
    ictx.fillRect(3, 7, 10, 5);
    ictx.fillStyle = RED;
    ictx.fillRect(5, 8, 6, 3);
    // Feet
    ictx.fillStyle = BROWN;
    ictx.fillRect(3, 13, 4, 3);
    ictx.fillRect(9, 13, 4, 3);
    this.sprites.set('mario_small_idle', sIdle);

    // 2. Small Mario Run 1, 2, 3
    for (let r = 1; r <= 3; r++) {
      const { canvas, ctx } = this.createCanvas(16, 16);
      ctx.drawImage(sIdle, 0, 0);
      ctx.clearRect(2, 12, 12, 4);
      ctx.fillStyle = BROWN;
      if (r === 1) {
        ctx.fillRect(1, 13, 5, 3);
        ctx.fillRect(10, 12, 4, 3);
      } else if (r === 2) {
        ctx.fillRect(4, 13, 4, 3);
        ctx.fillRect(8, 13, 4, 3);
      } else {
        ctx.fillRect(6, 12, 4, 3);
        ctx.fillRect(11, 13, 4, 3);
      }
      this.sprites.set(`mario_small_run_${r}`, canvas);
    }

    // 3. Small Mario Jump
    const { canvas: sJump, ctx: jctx } = this.createCanvas(16, 16);
    jctx.drawImage(sIdle, 0, 0);
    jctx.clearRect(2, 12, 12, 4);
    jctx.fillStyle = BROWN;
    jctx.fillRect(1, 11, 4, 4); // Left foot back
    jctx.fillRect(11, 13, 4, 3); // Right foot forward
    this.sprites.set('mario_small_jump', sJump);

    // 4. Small Mario Die
    const { canvas: sDie, ctx: dctx } = this.createCanvas(16, 16);
    dctx.drawImage(sIdle, 0, 0);
    dctx.fillStyle = '#000000';
    dctx.fillRect(9, 3, 2, 2); // 'X' eye
    this.sprites.set('mario_small_die', sDie);

    // 5. Super Mario Idle (16x32)
    const { canvas: supIdle, ctx: spctx } = this.createCanvas(16, 32);
    // Hat
    spctx.fillStyle = RED;
    spctx.fillRect(5, 3, 6, 2);
    spctx.fillRect(4, 5, 10, 2);
    // Face
    spctx.fillStyle = BROWN;
    spctx.fillRect(3, 7, 3, 3);
    spctx.fillStyle = SKIN;
    spctx.fillRect(6, 7, 7, 5);
    spctx.fillStyle = BROWN;
    spctx.fillRect(9, 7, 1, 3); // Eye
    spctx.fillRect(8, 10, 5, 2); // Moustache
    // Shirt & Overalls (Red & Blue)
    spctx.fillStyle = RED;
    spctx.fillRect(4, 12, 8, 6);
    spctx.fillStyle = BLUE;
    spctx.fillRect(3, 16, 10, 9);
    spctx.fillStyle = RED;
    spctx.fillRect(6, 17, 4, 5);
    // Yellow Buttons
    spctx.fillStyle = '#fcbc00';
    spctx.fillRect(5, 19, 1, 2);
    spctx.fillRect(10, 19, 1, 2);
    // Legs & Shoes
    spctx.fillStyle = BLUE;
    spctx.fillRect(3, 25, 4, 4);
    spctx.fillRect(9, 25, 4, 4);
    spctx.fillStyle = BROWN;
    spctx.fillRect(2, 28, 5, 4);
    spctx.fillRect(9, 28, 5, 4);
    this.sprites.set('mario_super_idle', supIdle);

    // Super Mario Run 1, 2, 3
    for (let r = 1; r <= 3; r++) {
      const { canvas, ctx } = this.createCanvas(16, 32);
      ctx.drawImage(supIdle, 0, 0);
      ctx.clearRect(1, 25, 14, 7);
      ctx.fillStyle = BLUE;
      ctx.fillRect(r === 1 ? 2 : 4, 25, 4, 4);
      ctx.fillRect(r === 1 ? 10 : 8, 25, 4, 4);
      ctx.fillStyle = BROWN;
      ctx.fillRect(r === 1 ? 1 : 3, 28, 5, 4);
      ctx.fillRect(r === 1 ? 11 : 9, 28, 5, 4);
      this.sprites.set(`mario_super_run_${r}`, canvas);
    }

    // Super Mario Jump
    const { canvas: supJump, ctx: spjctx } = this.createCanvas(16, 32);
    spjctx.drawImage(supIdle, 0, 0);
    spjctx.clearRect(1, 24, 14, 8);
    spjctx.fillStyle = BROWN;
    spjctx.fillRect(1, 23, 5, 4);
    spjctx.fillRect(10, 27, 5, 4);
    this.sprites.set('mario_super_jump', supJump);
  }

  initEnemies() {
    // 1. Goomba (Walk 1, Walk 2, Flat Squished)
    const { canvas: g1, ctx: g1ctx } = this.createCanvas(16, 16);
    // Head / Body (Brown Mushroom shape)
    g1ctx.fillStyle = '#b84418';
    g1ctx.fillRect(4, 2, 8, 6);
    g1ctx.fillRect(2, 4, 12, 6);
    // Face (Beige)
    g1ctx.fillStyle = '#fce4a0';
    g1ctx.fillRect(5, 8, 6, 4);
    // Angry Eyes
    g1ctx.fillStyle = '#000000';
    g1ctx.fillRect(5, 8, 2, 3);
    g1ctx.fillRect(9, 8, 2, 3);
    g1ctx.fillStyle = '#ffffff';
    g1ctx.fillRect(5, 9, 1, 2);
    g1ctx.fillRect(9, 9, 1, 2);
    // Feet
    g1ctx.fillStyle = '#000000';
    g1ctx.fillRect(2, 13, 5, 3);
    g1ctx.fillRect(9, 13, 4, 3);
    this.sprites.set('goomba_0', g1);

    // Goomba Walk 2 (feet mirrored)
    const { canvas: g2, ctx: g2ctx } = this.createCanvas(16, 16);
    g2ctx.drawImage(g1, 0, 0);
    g2ctx.clearRect(2, 13, 12, 3);
    g2ctx.fillStyle = '#000000';
    g2ctx.fillRect(3, 13, 4, 3);
    g2ctx.fillRect(9, 13, 5, 3);
    this.sprites.set('goomba_1', g2);

    // Goomba Flat (Squished)
    const { canvas: gf, ctx: gfctx } = this.createCanvas(16, 16);
    gfctx.fillStyle = '#b84418';
    gfctx.fillRect(2, 9, 12, 4);
    gfctx.fillStyle = '#fce4a0';
    gfctx.fillRect(4, 11, 8, 3);
    gfctx.fillStyle = '#000000';
    gfctx.fillRect(4, 11, 2, 2);
    gfctx.fillRect(10, 11, 2, 2);
    this.sprites.set('goomba_flat', gf);

    // 2. Koopa Troopa (Green Turtle, Walk 1 & 2, Shell)
    const { canvas: k1, ctx: k1ctx } = this.createCanvas(16, 24);
    // Head (Green & Yellow)
    k1ctx.fillStyle = '#80d010';
    k1ctx.fillRect(3, 1, 7, 6);
    k1ctx.fillStyle = '#000000';
    k1ctx.fillRect(4, 3, 2, 3);
    // Green Shell
    k1ctx.fillStyle = '#00a800';
    k1ctx.fillRect(5, 7, 9, 11);
    k1ctx.fillStyle = '#ffffff';
    k1ctx.fillRect(4, 9, 2, 7);
    // Feet
    k1ctx.fillStyle = '#fc9838';
    k1ctx.fillRect(3, 19, 4, 5);
    k1ctx.fillRect(10, 19, 4, 5);
    this.sprites.set('koopa_0', k1);

    const { canvas: k2, ctx: k2ctx } = this.createCanvas(16, 24);
    k2ctx.drawImage(k1, 0, 0);
    k2ctx.clearRect(3, 19, 11, 5);
    k2ctx.fillStyle = '#fc9838';
    k2ctx.fillRect(5, 19, 4, 5);
    k2ctx.fillRect(8, 19, 4, 5);
    this.sprites.set('koopa_1', k2);

    // Koopa Shell
    const { canvas: kShell, ctx: ksctx } = this.createCanvas(16, 16);
    ksctx.fillStyle = '#000000';
    ksctx.fillRect(2, 2, 12, 12);
    ksctx.fillStyle = '#00a800';
    ksctx.fillRect(3, 3, 10, 10);
    ksctx.fillStyle = '#fce4a0';
    ksctx.fillRect(5, 5, 6, 6);
    ksctx.fillStyle = '#00a800';
    ksctx.fillRect(7, 6, 2, 4);
    this.sprites.set('koopa_shell', kShell);

    // 3. Bowser Boss (32x32)
    for (let b = 0; b < 2; b++) {
      const { canvas: bCanv, ctx: bctx } = this.createCanvas(32, 32);
      // Green Spiked Shell
      bctx.fillStyle = '#00a800';
      bctx.fillRect(12, 10, 16, 16);
      bctx.fillStyle = '#ffffff'; // Shell spikes
      bctx.fillRect(16, 8, 3, 4);
      bctx.fillRect(24, 8, 3, 4);
      bctx.fillRect(26, 14, 4, 3);
      bctx.fillRect(26, 20, 4, 3);
      // Yellow Scaly Body & Limbs
      bctx.fillStyle = '#fc9838';
      bctx.fillRect(6, 12, 10, 14);
      bctx.fillRect(8, 26, 8, 5); // Feet
      bctx.fillRect(20, 26, 8, 5);
      // Red Spiked Hair & Horns
      bctx.fillStyle = '#d82800';
      bctx.fillRect(4, 4, 8, 6);
      bctx.fillRect(2, 6, 4, 4);
      bctx.fillStyle = '#ffffff'; // Horns & Claws
      bctx.fillRect(10, 2, 3, 5);
      bctx.fillRect(2, 22, 4, 3);
      // Eyes & Snout
      bctx.fillStyle = '#000000';
      bctx.fillRect(4, 10, 2, 3);
      bctx.fillStyle = b === 0 ? '#fcbc00' : '#d82800'; // Mouth fire glow
      bctx.fillRect(2, 15, 6, 3);
      this.sprites.set(`bowser_${b}`, bCanv);
    }

    // 4. Golden Axe Switch (16x16)
    const { canvas: axeCanv, ctx: actx } = this.createCanvas(16, 16);
    actx.fillStyle = '#fcbc00'; // Gold blade
    actx.fillRect(2, 2, 8, 6);
    actx.fillRect(4, 8, 4, 2);
    actx.fillStyle = '#ffffff'; // Shine
    actx.fillRect(3, 3, 3, 2);
    actx.fillStyle = '#a05000'; // Handle
    actx.fillRect(8, 6, 2, 10);
    this.sprites.set('axe', axeCanv);

    // 5. Toad / Mushroom Retainer (16x16)
    const { canvas: toadCanv, ctx: tctx } = this.createCanvas(16, 16);
    // Mushroom Cap (White with Red Dots)
    tctx.fillStyle = '#ffffff';
    tctx.fillRect(3, 1, 10, 7);
    tctx.fillStyle = '#d82800';
    tctx.fillRect(5, 2, 3, 3);
    tctx.fillRect(10, 3, 2, 3);
    tctx.fillRect(4, 6, 2, 2);
    // Face
    tctx.fillStyle = '#fce4a0';
    tctx.fillRect(5, 7, 6, 4);
    tctx.fillStyle = '#000000';
    tctx.fillRect(6, 8, 1, 2);
    tctx.fillRect(9, 8, 1, 2);
    // Blue Vest & White Pants
    tctx.fillStyle = '#0058f8';
    tctx.fillRect(4, 11, 8, 3);
    tctx.fillStyle = '#ffffff';
    tctx.fillRect(5, 14, 6, 2);
    this.sprites.set('toad', toadCanv);

    // 6. Cheep Cheep (Red Flying Fish, 16x16)
    for (let c = 0; c < 2; c++) {
      const { canvas: cp, ctx: cpctx } = this.createCanvas(16, 16);
      cpctx.fillStyle = '#d82800'; // Red body
      cpctx.fillRect(3, 4, 10, 8);
      cpctx.fillStyle = '#ffffff'; // White belly & big eye
      cpctx.fillRect(3, 8, 8, 4);
      cpctx.fillRect(3, 5, 4, 4);
      cpctx.fillStyle = '#000000'; // Pupil
      cpctx.fillRect(4, 6, 2, 2);
      cpctx.fillStyle = '#fcbc00'; // Yellow wing/fins
      if (c === 0) cpctx.fillRect(8, 2, 4, 4);
      else cpctx.fillRect(8, 6, 4, 4);
      cpctx.fillRect(12, 6, 3, 4); // Tail
      this.sprites.set(`cheep_${c}`, cp);
    }

    // 7. Blooper (White Squid, 16x16)
    const { canvas: blp, ctx: blpctx } = this.createCanvas(16, 16);
    blpctx.fillStyle = '#ffffff';
    blpctx.fillRect(4, 2, 8, 9);
    blpctx.fillRect(2, 6, 12, 4);
    blpctx.fillStyle = '#000000'; // Black eye mask
    blpctx.fillRect(4, 6, 8, 2);
    blpctx.fillStyle = '#ffffff'; // Eyes
    blpctx.fillRect(5, 6, 2, 1);
    blpctx.fillRect(9, 6, 2, 1);
    // Tentacles
    blpctx.fillStyle = '#ffffff';
    blpctx.fillRect(3, 11, 2, 4);
    blpctx.fillRect(7, 11, 2, 4);
    blpctx.fillRect(11, 11, 2, 4);
    this.sprites.set('blooper_0', blp);
  }

  initItems() {
    // 1. Super Mushroom (16x16)
    const { canvas: mush, ctx: mctx } = this.createCanvas(16, 16);
    mctx.fillStyle = '#b82400'; // Red cap
    mctx.fillRect(2, 2, 12, 8);
    mctx.fillRect(4, 1, 8, 1);
    // White spots
    mctx.fillStyle = '#ffffff';
    mctx.fillRect(4, 3, 3, 3);
    mctx.fillRect(9, 3, 3, 3);
    mctx.fillRect(6, 6, 4, 3);
    // Stem
    mctx.fillStyle = '#fce4a0';
    mctx.fillRect(4, 9, 8, 6);
    mctx.fillStyle = '#000000';
    mctx.fillRect(5, 10, 1, 3);
    mctx.fillRect(10, 10, 1, 3);
    this.sprites.set('mushroom', mush);

    // 2. Fire Flower (16x16)
    const { canvas: flw, ctx: fctx } = this.createCanvas(16, 16);
    fctx.fillStyle = '#b82400';
    fctx.fillRect(4, 1, 8, 8);
    fctx.fillStyle = '#fc9838';
    fctx.fillRect(5, 2, 6, 6);
    fctx.fillStyle = '#ffffff';
    fctx.fillRect(6, 3, 4, 4);
    fctx.fillStyle = '#00a800';
    fctx.fillRect(7, 9, 2, 6);
    fctx.fillRect(5, 11, 6, 2);
    this.sprites.set('fireflower', flw);

    // 3. Spinning Coin (4 frames)
    for (let f = 0; f < 4; f++) {
      const { canvas, ctx } = this.createCanvas(16, 16);
      const w = f === 0 ? 10 : (f === 1 ? 6 : (f === 2 ? 2 : 6));
      const x = 8 - Math.floor(w / 2);
      ctx.fillStyle = '#000000';
      ctx.fillRect(x, 1, w, 14);
      ctx.fillStyle = '#fcbc00';
      ctx.fillRect(x + 1, 2, w - 2, 12);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 2, 3, Math.max(1, w - 4), 3);
      this.sprites.set(`coin_${f}`, canvas);
    }

    // 4. Bouncing Fireball (8x8)
    const { canvas: fb, ctx: fbctx } = this.createCanvas(8, 8);
    fbctx.fillStyle = '#fc9838';
    fbctx.fillRect(1, 1, 6, 6);
    fbctx.fillStyle = '#ffffff';
    fbctx.fillRect(2, 2, 4, 4);
    fbctx.fillStyle = '#b82400';
    fbctx.fillRect(3, 3, 2, 2);
    this.sprites.set('fireball', fb);

    // 5. Poison Mushroom (16x16) - Dark purple with skull eyes
    const { canvas: pmush, ctx: pmctx } = this.createCanvas(16, 16);
    pmctx.fillStyle = '#6a0dad'; // Deep toxic purple
    pmctx.fillRect(2, 2, 12, 8);
    pmctx.fillRect(4, 1, 8, 1);
    pmctx.fillStyle = '#2e0854'; // Dark spots
    pmctx.fillRect(4, 3, 3, 3);
    pmctx.fillRect(9, 3, 3, 3);
    pmctx.fillRect(6, 6, 4, 3);
    pmctx.fillStyle = '#d8b4e2'; // Pale sickly stem
    pmctx.fillRect(4, 9, 8, 6);
    pmctx.fillStyle = '#000000'; // Eyes
    pmctx.fillRect(5, 10, 1, 3);
    pmctx.fillRect(10, 10, 1, 3);
    this.sprites.set('poison_mushroom', pmush);

    // 6. Super Star (16x16) - 4 flashing color frames
    const starColors = ['#fcbc00', '#fc7460', '#60b0fc', '#70e070'];
    for (let s = 0; s < 4; s++) {
      const { canvas: starCanv, ctx: sctx } = this.createCanvas(16, 16);
      sctx.fillStyle = starColors[s];
      // Draw 5-pointed star pixel shape
      sctx.fillRect(7, 1, 2, 2);
      sctx.fillRect(6, 3, 4, 2);
      sctx.fillRect(2, 5, 12, 3);
      sctx.fillRect(4, 8, 8, 3);
      sctx.fillRect(3, 11, 4, 4);
      sctx.fillRect(9, 11, 4, 4);
      // Star Eyes
      sctx.fillStyle = '#000000';
      sctx.fillRect(6, 5, 1, 3);
      sctx.fillRect(9, 5, 1, 3);
      this.sprites.set(`star_${s}`, starCanv);
    }
  }

  get(name) {
    return this.sprites.get(name);
  }
}
