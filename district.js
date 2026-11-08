(() => {
  const canvas = document.querySelector('#district-map');
  const ctx = canvas.getContext('2d');
  const radio = document.querySelector('#map-radio');
  const interact = document.querySelector('#map-interact');
  const caseIndicator = document.querySelector('#radio-case-indicator');
  const folders = [...document.querySelectorAll('.mission')];
  const sites = [
    [2, 2, 'Praça do Bairro', 'Caso 01 · Boato no Feed'],
    [5, 2, 'Redação Antiga', 'Caso 02 · Cronologia'],
    [9, 2, 'Sala do Feed', 'Caso 03 · Algoritmo'],
    [12, 2, 'Agência Estação', 'Caso 04 · Anúncio Urgente'],
    [12, 6, 'Caixa de Entrada', 'Caso 05 · Phishing'],
    [9, 6, 'Central de Segurança', 'Caso 06 · Blindagem'],
    [5, 6, 'Plantão de Golpes', 'Caso 07 · Pix e Fraudes'],
    [2, 6, 'Arquivo Central', 'Caso 08 · Fio Vermelho'],
  ];
  const moves = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const keys = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
  let x = 2;
  let y = 4;

  function drawBlueprintGrid() {
    ctx.fillStyle = 'rgba(13, 21, 24, 0.52)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle forensic blueprint grid
    ctx.strokeStyle = 'rgba(232, 190, 118, 0.08)';
    ctx.lineWidth = 1;
    for (let gx = 48; gx < canvas.width; gx += 48) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, canvas.height);
      ctx.stroke();
    }
    for (let gy = 48; gy < canvas.height; gy += 48) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(canvas.width, gy);
      ctx.stroke();
    }

    // Main avenues of Camaragibe district
    ctx.fillStyle = 'rgba(34, 46, 48, 0.72)';
    ctx.fillRect(48, 82, 624, 28);
    ctx.fillRect(48, 274, 624, 28);
    ctx.fillRect(82, 82, 28, 220);
    ctx.fillRect(562, 82, 28, 220);

    // Dashed avenue centerlines
    ctx.strokeStyle = 'rgba(237, 195, 132, 0.28)';
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(64, 96);
    ctx.lineTo(656, 96);
    ctx.moveTo(64, 288);
    ctx.lineTo(656, 288);
    ctx.stroke();
    ctx.setLineDash([]);

    // Avenue label
    ctx.fillStyle = 'rgba(237, 195, 132, 0.5)';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('AV. BELMINO CORREIA · CORREDOR DE INVESTIGAÇÃO', 62, 196);
  }

  function drawRedThreads() {
    // Draw crimson red string connecting all 8 investigation pins
    for (let i = 0; i < sites.length - 1; i++) {
      const [c1, r1] = sites[i];
      const [c2, r2] = sites[i + 1];
      const x1 = c1 * 48;
      const y1 = r1 * 48;
      const x2 = c2 * 48;
      const y2 = r2 * 48;
      const unlocked = !folders[i + 1]?.disabled;

      // Shadow of string
      ctx.beginPath();
      ctx.moveTo(x1, y1 + 3);
      ctx.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 + 12, x2, y2 + 3);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Red thread
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo((x1 + x2) / 2, (y1 + y2) / 2 + 8, x2, y2);
      ctx.strokeStyle = unlocked ? '#e03c2d' : 'rgba(180, 75, 62, 0.42)';
      ctx.lineWidth = unlocked ? 3 : 2;
      if (!unlocked) ctx.setLineDash([5, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBlueprintGrid();
    drawRedThreads();

    // Detective flashlight spotlight around player position
    const px = x * 48;
    const py = y * 48;
    const grad = ctx.createRadialGradient(px, py, 8, px, py, 110);
    grad.addColorStop(0, 'rgba(244, 191, 110, 0.25)');
    grad.addColorStop(1, 'rgba(244, 191, 110, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, 110, 0, 2 * Math.PI);
    ctx.fill();

    // Draw each case location pin & Polaroid label tag
    sites.forEach(([column, row, placeName], index) => {
      const left = column * 48;
      const top = row * 48;
      const folder = folders[index];
      if (!folder) return;
      const isComplete = folder.classList.contains('is-complete');
      const isDisabled = folder.disabled;
      const isHere = x === column && y === row;

      // Location label plate below pin
      ctx.fillStyle = isHere ? 'rgba(43, 30, 20, 0.96)' : 'rgba(15, 22, 24, 0.86)';
      ctx.strokeStyle = isHere ? '#f4bf6e' : isComplete ? '#55a886' : '#6e5840';
      ctx.lineWidth = isHere ? 2 : 1;
      ctx.beginPath();
      ctx.roundRect(left - 56, top + 20, 112, 22, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isDisabled ? '#9aa5a0' : '#fff2d6';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(placeName.toUpperCase(), left, top + 34);

      // Outer pin ring
      ctx.beginPath();
      ctx.arc(left, top, isHere ? 21 : 18, 0, 2 * Math.PI);
      ctx.fillStyle = isComplete ? '#1f523f' : isDisabled ? '#1b2226' : '#a8281b';
      ctx.fill();
      ctx.lineWidth = isHere ? 3 : 2;
      ctx.strokeStyle = isComplete ? '#8ce0bc' : isDisabled ? '#6d787d' : '#ffdf9e';
      ctx.stroke();

      // Inner pin head
      ctx.beginPath();
      ctx.arc(left, top, 13, 0, 2 * Math.PI);
      ctx.fillStyle = isComplete ? '#439c78' : isDisabled ? '#2a3338' : '#e8be7f';
      ctx.fill();

      ctx.fillStyle = isComplete ? '#fff' : isDisabled ? '#b5c0b8' : '#23160d';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(isComplete ? '✓' : String(index + 1).padStart(2, '0'), left, top + 5);
    });

    // Draw Detective Investigator Token
    ctx.beginPath();
    ctx.arc(px, py, 24, 0, 2 * Math.PI);
    ctx.strokeStyle = '#98f5cd';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#132824';
    ctx.beginPath();
    ctx.arc(px, py - 24, 11, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#f4bf6e';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#f4bf6e';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⌕', px, py - 20);
  }

  function refresh() {
    const index = sites.findIndex(([column, row]) => x === column && y === row);
    const folder = folders[index];
    interact.disabled = !folder || folder.disabled;
    interact.onclick = folder ? () => folder.click() : null;
    if (caseIndicator) {
      caseIndicator.textContent = folder ? sites[index][3] : 'Em patrulha no distrito';
    }
    const message = folder
      ? sites[index][2] + ' (' + sites[index][3] + ') · ' + (folder.disabled ? 'Pasta lacrada. Conclua a investigação anterior para liberar.' : 'Evidências prontas na mesa. Clique em Investigar Local ou pressione Enter.')
      : 'Use as setas ou clique sobre um pino numerado no quadro tático de Camaragibe para abrir o dossiê do caso.';
    if (!document.querySelector('#missao').hidden && radio.textContent !== message) radio.textContent = message;
    draw();
  }

  function move(direction) {
    const [dx, dy] = moves[direction];
    x = Math.max(1, Math.min(13, x + dx));
    y = Math.max(1, Math.min(7, y + dy));
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
    const site = sites.find(([column, row]) => Math.hypot(column * 48 - px, row * 48 - py) <= 32);
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
