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

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#e8be7f85';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    sites.forEach(([column, row], index) => {
      if (index === 0) ctx.moveTo(column * 48, row * 48);
      else ctx.lineTo(column * 48, row * 48);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    sites.forEach(([column, row], index) => {
      const left = column * 48;
      const top = row * 48;
      const folder = folders[index];
      ctx.beginPath();
      ctx.arc(left, top, 17, 0, 2 * Math.PI);
      ctx.fillStyle = folder.disabled ? '#192027' : '#e8be7f';
      ctx.fill();
      ctx.strokeStyle = folder.disabled ? '#acb3b9' : '#fff1c8';
      ctx.stroke();
      ctx.fillStyle = folder.disabled ? '#d1d7d9' : '#211811';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(folder.classList.contains('is-complete') ? '✓' : String(index + 1), left, top + 6);
    });
    ctx.beginPath();
    ctx.arc(x * 48, y * 48, 24, 0, 2 * Math.PI);
    ctx.strokeStyle = '#a6f7db';
    ctx.stroke();
    ctx.fillStyle = '#a6f7db';
    ctx.fillText('◆', x * 48, y * 48 + 6);
  }

  function refresh() {
    const index = sites.findIndex(([column, row]) => x === column && y === row);
    const folder = folders[index];
    interact.disabled = !folder || folder.disabled;
    interact.onclick = folder ? () => folder.click() : null;
    const message = folder
      ? sites[index][2] + ' · Pasta ' + (index + 1) + (folder.disabled ? ' lacrada. Resolva o caso anterior.' : ' disponível para investigar.')
      : 'Cada número é um local da investigação. Ande até uma entrada ou abra a pasta correspondente.';
    if (!document.querySelector('#missao').hidden && radio.textContent !== message) radio.textContent = message;
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
  canvas.addEventListener('pointerdown', (event) => {
    const bounds = canvas.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width * canvas.width;
    const py = (event.clientY - bounds.top) / bounds.height * canvas.height;
    const site = sites.find(([column, row]) => Math.hypot(column * 48 - px, row * 48 - py) <= 25);
    if (site) {
      [x, y] = site;
      refresh();
      if (!interact.disabled) interact.focus();
    }
  });
  document.querySelectorAll('[data-move]').forEach((button) => {
    button.onclick = () => move(button.dataset.move);
  });
  document.addEventListener('case-progress', refresh);
  refresh();
})();
