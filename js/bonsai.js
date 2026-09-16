//based of off cbonsai https://gitlab.com/jallbrit/cbonsai, converted using claude code
(function () {
  const W = 80, H = 26, LIFE = 50, MULT = 7;
  const LEAVES = ['&'];
  const TRUNK = 0, SHOOT_L = 1, SHOOT_R = 2, DYING = 3, DEAD = 4;

  let seed = Date.now();
  function rand(n) {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return (seed >>> 0) % n;
  }

  // direct port of cbonsai setDeltas()
  function setDeltas(type, life, age) {
    let dx = 0, dy = 0, r;
    switch (type) {
      case TRUNK:
        if (age <= 2 || life < 4) {
          dy = 0; dx = rand(3) - 1;
        } else if (age < MULT * 3) {
          dy = (age % Math.floor(MULT * 0.5) === 0) ? -1 : 0;
          r = rand(10);
          dx = r <= 0 ? -2 : r <= 3 ? -1 : r <= 5 ? 0 : r <= 8 ? 1 : 2;
        } else {
          dy = rand(10) > 2 ? -1 : 0;
          dx = rand(3) - 1;
        }
        break;
      case SHOOT_L:
        r = rand(10); dy = r <= 1 ? -1 : r <= 7 ? 0 : 1;
        r = rand(10); dx = r <= 1 ? -2 : r <= 5 ? -1 : r <= 8 ? 0 : 1;
        break;
      case SHOOT_R:
        r = rand(10); dy = r <= 1 ? -1 : r <= 7 ? 0 : 1;
        r = rand(10); dx = r <= 1 ? 2 : r <= 5 ? 1 : r <= 8 ? 0 : -1;
        break;
      case DYING:
        r = rand(10); dy = r <= 1 ? -1 : r <= 8 ? 0 : 1;
        r = rand(15); dx = r <= 0 ? -3 : r <= 2 ? -2 : r <= 5 ? -1 : r <= 8 ? 0 : r <= 11 ? 1 : r <= 13 ? 2 : 3;
        break;
      case DEAD:
        r = rand(10); dy = r <= 2 ? -1 : r <= 6 ? 0 : 1;
        dx = rand(3) - 1;
        break;
    }
    return { dx, dy };
  }

  // direct port of cbonsai chooseString()
  function chooseStr(type, life, dx, dy) {
    if (life < 4) type = DYING;
    switch (type) {
      case TRUNK:
        if (dy === 0)  return '/~';
        if (dx < 0)   return '\\|';
        if (dx === 0)  return '/|\\';
        return '|/';
      case SHOOT_L:
        if (dy > 0)   return '\\';
        if (dy === 0)  return '\\_';
        if (dx < 0)   return '\\|';
        if (dx === 0)  return '/|';
        return '/';
      case SHOOT_R:
        if (dy > 0)   return '/';
        if (dy === 0)  return '_/';
        if (dx < 0)   return '\\|';
        if (dx === 0)  return '/|';
        return '/';
      default:
        return LEAVES[rand(LEAVES.length)];
    }
  }

  // direct port of cbonsai chooseColor() — returns CSS class
  function chooseColor(type) {
    switch (type) {
      case TRUNK: case SHOOT_L: case SHOOT_R:
        return rand(2) === 0 ? 'wb' : 'wd';
      case DYING:
        return 'll';
      case DEAD:
        return 'ld';
    }
    return 'wd';
  }

  const steps = [];
  let shootCounter = 0;

  // direct port of cbonsai branch()
  function branch(y, x, type, life) {
    let age = 0;
    let shootCooldown = MULT;

    while (life > 0) {
      life--;
      age++;

      let { dx, dy } = setDeltas(type, life, age);
      if (dy > 0 && y > H - 2) dy--;

      if (life < 3) {
        branch(y, x, DEAD, life);
      } else if (type === TRUNK && life < MULT + 2) {
        branch(y, x, DYING, life);
      } else if ((type === SHOOT_L || type === SHOOT_R) && life < MULT + 2) {
        branch(y, x, DYING, life);
      } else if (type === TRUNK && (rand(3) === 0 || life % MULT === 0)) {
        if (rand(8) === 0 && life > 7) {
          shootCooldown = MULT * 2;
          branch(y, x, TRUNK, life + rand(5) - 2);
        } else if (shootCooldown <= 0) {
          shootCooldown = MULT * 2;
          branch(y, x, (shootCounter++ % 2) + 1, life + MULT);
        }
      }
      shootCooldown--;

      x += dx;
      y += dy;

      const str = chooseStr(type, life, dx, dy);
      const color = chooseColor(type);
      for (let i = 0; i < str.length; i++) {
        const nx = x + i;
        if (nx >= 0 && nx < W && y >= 0 && y < H)
          steps.push([y, nx, str[i], color]);
      }
    }
  }

  branch(H - 1, W / 2 | 0, TRUNK, LIFE);

  // drawBase type 1 — direct port of cbonsai drawBase(baseWin, 1)
  // baseWidth=31, centered: (80/2) - (31/2) = 40-15 = 25
  const P = ' '.repeat(25);
  const baseLines = [
    P + '<span class="tx">:</span><span class="ll">___________</span><span class="wb">./~~~\\.</span><span class="ll">___________</span><span class="tx">:</span>',
    P + '<span class="tx"> \\                           / </span>',
    P + '<span class="tx">  \\_________________________/ </span>',
    P + '<span class="tx">  (_)                     (_)</span>',
  ];

  const pre = document.getElementById('bonsai');
  const grid = Array.from({ length: H }, () => Array(W).fill(' '));
  const clsGrid = Array.from({ length: H }, () => Array(W).fill(''));

  function render() {
    let html = '';
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const ch = grid[r][c];
        if (ch === ' ') { html += ' '; continue; }
        const esc = ch === '&' ? '&amp;' : ch;
        html += `<span class="${clsGrid[r][c]}">${esc}</span>`;
      }
      html += '\n';
    }
    html += baseLines.join('\n');
    pre.innerHTML = html;
  }

  render();

  let i = 0;
  function tick() {
    for (let b = 0; b < 3 && i < steps.length; b++) {
      const [y, x, ch, cls] = steps[i++];
      grid[y][x] = ch;
      clsGrid[y][x] = cls;
    }
    render();
    if (i < steps.length) setTimeout(tick, 50);
  }
  setTimeout(tick, 400);
})();
