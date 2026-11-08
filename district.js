(() => {
  const canvas = document.querySelector('#district-map');
  const ctx = canvas.getContext('2d');
  const radio = document.querySelector('#map-radio');
  const interact = document.querySelector('#map-interact');
  const folders = [...document.querySelectorAll('.mission')];
  const sites = [
    [2, 2, 'Praça do bairro'],
    [5, 2, 'Redação'],
    [8, 2, 'Sala do feed'],
    [12, 2, 'Agência'],
    [12, 6, 'Caixa de entrada'],
    [8, 6, 'Central de segurança'],
    [3, 6, 'Arquivo central'],
  ];
  const moves = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const keys = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
  let x = 2;
  let y = 4;

  function rect(color, left, top, width, height) {
    ctx.fillStyle = color;
    ctx.fillRect(left, top, width, height);
  }

  function draw() {
    if (!ctx) return;
    rect('#d8bd8d', 0, 0, 240, 144);
    rect('#b69970', 0, 50, 240, 42);
    rect('#ded0ae', 0, 66, 240, 12);
    for (let left = 8; left < 240; left += 20) {
      rect('#a48765', left, 57, 10, 2);
      rect('#a48765', left, 84, 10, 2);
    }
    sites.forEach(([column, row], index) => {
      const left = column * 16;
      const top = row * 16;
      const folder = folders[index];
      rect('#83684f', left - 12, top - 15, 25, 24);
      rect('#5d463b', left - 13, top - 17, 27, 9);
      rect('#b08c62', left - 10, top - 8, 21, 15);
      rect('#efe2bc', left - 7, top - 5, 4, 5);
      rect('#efe2bc', left + 5, top - 5, 4, 5);
      rect(folder.disabled ? '#65584d' : '#8b2d2a', left - 4, top + 2, 10, 11);
      ctx.fillStyle = '#fff5da';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(String(index + 1), left + 1, top + 10);
    });
    const left = x * 16;
    const top = y * 16;
    rect('#3c312d', left - 4, top + 6, 10, 3);
    rect('#743d30', left - 4, top, 10, 7);
    rect('#f0ca9a', left - 2, top - 4, 6, 5);
    rect('#27251f', left - 4, top - 6, 10, 3);
    rect('#27251f', left - 2, top - 9, 6, 4);
  }

  function refresh() {
    const index = sites.findIndex(([column, row]) => x === column && y === row);
    const folder = folders[index];
    interact.disabled = !folder || folder.disabled;
    interact.onclick = folder ? () => folder.click() : null;
    const message = folder
      ? sites[index][2] + ' · Pasta ' + (index + 1) + (folder.disabled ? ' lacrada. Resolva o caso anterior.' : ' disponível para investigar.')
      : 'Cada número é um local da investigação. Ande até uma entrada ou abra a pasta correspondente.';
    if (radio.textContent !== message) radio.textContent = message;
    draw();
  }

  function move(direction) {
    const [dx, dy] = moves[direction];
    x = Math.max(1, Math.min(14, x + dx));
    y = Math.max(1, Math.min(8, y + dy));
    refresh();
  }

  canvas.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase().length === 1 ? event.key.toLowerCase() : event.key;
    if (Object.hasOwn(keys, key)) {
      event.preventDefault();
      move(keys[key]);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      interact.click();
    }
  });
  document.querySelectorAll('[data-move]').forEach((button) => {
    button.onclick = () => move(button.dataset.move);
  });
  document.addEventListener('case-progress', refresh);
  refresh();
})();
