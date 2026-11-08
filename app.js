const missions = {
  news: {
    label: '01 · Investigação',
    title: 'O detetive do feed',
    scene: 'DOSSIÊ ABERTO',
    badge: 'Olhar crítico',
    recap: 'A imagem era antiga, a autoria era desconhecida e a pressão para compartilhar escondia a falta de contexto.',
    play: investigate,
  },
  influence: {
    label: '02 · Simulação',
    title: 'Por trás da tela',
    scene: 'FEED EM TEMPO REAL',
    badge: 'Leitura de feed',
    recap: 'Suas interações mudaram as próximas sugestões. Na vida real, cada plataforma combina vários sinais para recomendar conteúdo.',
    play: trainFeed,
  },
  privacy: {
    label: '03 · Defesa',
    title: 'Modo proteção',
    scene: 'CONTA SOB ATAQUE',
    badge: 'Modo proteção',
    recap: 'A senha exclusiva, o segundo fator e a verificação pelo canal oficial bloquearam ameaças diferentes.',
    play: defend,
  },
};

const routes = {
  Explorador: 'Olhar crítico · Fontes e contexto',
  Analista: 'Leitura de padrões · Dados e algoritmos',
  Estrategista: 'Influência · Emoções e persuasão',
  Guardião: 'Proteção · Privacidade e segurança',
};

const $ = (selector) => document.querySelector(selector);
const all = (selector) => [...document.querySelectorAll(selector)];
const stage = $('#game-stage');
const result = $('#result');
const next = $('#next');
const missionIds = Object.keys(missions);
const avatars = all('.avatar-option');
const missionButtons = all('.mission');
const reward = 60;

function read(key) {
  try {
    return localStorage.getItem('cd-' + key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem('cd-' + key, value);
    return true;
  } catch {
    return false;
  }
}

function loadProgress() {
  try {
    const progress = JSON.parse(read('progress'));
    if (progress && Array.isArray(progress.done) && Number.isFinite(progress.xp)) {
      return { xp: Math.max(0, progress.xp), done: new Set(progress.done.filter((id) => missionIds.includes(id))) };
    }
  } catch {
    // Fall back to the keys used by the previous version.
  }
  const xp = Number(read('xp'));
  let done = [];
  try {
    done = JSON.parse(read('done'));
  } catch {
    // Start with an empty mission log if the old entry is damaged.
  }
  return {
    xp: Number.isFinite(xp) ? Math.max(0, xp) : 0,
    done: new Set(Array.isArray(done) ? done.filter((id) => missionIds.includes(id)) : []),
  };
}

let progress = loadProgress();
let avatar = avatars.find((button) => button.dataset.name === read('name')) || avatars[0];
let activeMission = null;

function focus(selector) {
  const element = $(selector);
  element.focus({ preventScroll: true });
  element.scrollIntoView({ block: 'nearest' });
}

function updateHud() {
  const { xp, done } = progress;
  const level = Math.min(5, Math.floor(xp / reward) + 1);
  $('#xp').textContent = xp;
  $('#level').textContent = 'Nível ' + level;
  $('#xp-fill').style.width = (done.size === missionIds.length || level === 5 ? 100 : (xp % reward) / reward * 100) + '%';
  $('#completed').textContent = done.size;
  $('#hud-stars').textContent = '★'.repeat(done.size) + '☆'.repeat(missionIds.length - done.size);
  $('#hud-stars').setAttribute('aria-label', done.size + ' de 3 estrelas');
  $('#player-name').textContent = avatar.dataset.name;
  $('#hero-caption').textContent = routes[avatar.dataset.name];
  for (const selector of ['#avatar-mini', '#hero-avatar', '#game-avatar']) {
    $(selector).textContent = avatar.dataset.avatar;
  }
  avatars.forEach((button) => {
    button.classList.toggle('selected', button === avatar);
    button.setAttribute('aria-pressed', button === avatar);
  });
  missionButtons.forEach((button) => {
    const id = button.dataset.track;
    const complete = done.has(id);
    button.classList.toggle('is-active', activeMission === id);
    button.classList.toggle('is-complete', complete);
    button.querySelector('.mission-status').textContent = complete
      ? '★ Concluída · Rejogar'
      : activeMission === id ? 'Em andamento' : 'Disponível · 60 XP';
    const skill = $('#skill-' + id);
    skill.classList.toggle('unlocked', complete);
    skill.querySelector('small').textContent = complete ? 'Desbloqueado' : 'Bloqueado';
  });
  const won = done.size === missionIds.length;
  $('.final-skill').classList.toggle('unlocked', won);
  $('.final-skill small').textContent = won ? 'Jornada concluída' : 'Complete as três missões';
}

function setBar(value, total) {
  $('#bar-fill').style.width = value / total * 100 + '%';
}

function feedback(message = '', type = '') {
  result.textContent = message;
  result.classList.toggle('is-success', type === 'success');
  result.classList.toggle('is-warning', type === 'warning');
}

function showNext(label, action) {
  next.textContent = label;
  next.onclick = action;
  next.hidden = false;
}

function returnToMap() {
  activeMission = null;
  $('#play').hidden = true;
  updateHud();
  focus('#map-title');
}

function startMission(id) {
  const mission = missions[id];
  activeMission = id;
  $('#play').hidden = false;
  $('#mission-name').textContent = 'MISSÃO ' + mission.label.toUpperCase();
  $('#scenario').textContent = mission.scene;
  $('#question').textContent = mission.title;
  next.hidden = true;
  feedback();
  setBar(0, 1);
  mission.play();
  updateHud();
  focus('#question');
}

function finishMission(detail = '') {
  const id = activeMission;
  const mission = missions[id];
  activeMission = null;
  const saved = loadProgress();
  // A second tab may have completed a mission since this tab opened.
  for (const completed of saved.done) progress.done.add(completed);
  progress.xp = Math.max(progress.xp, saved.xp);
  const firstClear = !progress.done.has(id);
  if (firstClear) {
    progress.done.add(id);
    progress.xp += reward;
  }
  const stored = write('progress', JSON.stringify({ xp: progress.xp, done: [...progress.done] }));
  const nextId = missionIds.find((candidate) => !progress.done.has(candidate));
  $('#scenario').textContent = nextId ? 'MISSÃO CUMPRIDA' : 'CAMPANHA CONCLUÍDA';
  $('#question').textContent = nextId ? 'Operação bem-sucedida' : 'Você é Guardião digital!';
  stage.innerHTML = '<article class="mission-recap"><p class="chapter-reward">★ ' +
    (firstClear ? '+60 XP · ' + mission.badge : 'Missão concluída novamente') +
    '</p><p>' + mission.recap + '</p></article>';
  if (detail) {
    const summary = document.createElement('p');
    summary.textContent = detail;
    $('.mission-recap').append(summary);
  }
  setBar(1, 1);
  feedback(stored ? '' : 'O navegador bloqueou o salvamento. O progresso vale nesta sessão.', 'warning');
  showNext(nextId ? 'Ir para a próxima missão →' : 'Voltar ao mapa →',
    nextId ? () => startMission(nextId) : returnToMap);
  updateHud();
  focus('#question');
}

const evidence = [
  { label: 'Perfil', detail: 'Radar Agora republicou a imagem. O perfil não identifica quem escreveu o aviso.', valid: true },
  { label: 'Imagem', detail: 'O arquivo original aparece numa campanha antiga, de outra cidade.', valid: true },
  { label: 'Legenda', detail: 'O texto pede pressa e ameaça apagar o post. Não há link para o aviso oficial.', valid: true },
  { label: 'Reações', detail: 'O post recebeu 2,4 mil curtidas. Esse número mede popularidade, sem confirmar o aviso.', valid: false },
];

function investigate() {
  const inspected = new Set();
  const pinned = new Set();
  let selected = 0;
  stage.innerHTML = `
    <article class="post-card">
      <p class="kicker">Publicação simulada · Radar Agora</p>
      <h3>URGENTE: o aviso mudou. Compartilhe antes que apaguem!</h3>
      <p>Abra os detalhes do post e fixe no dossiê as pistas que ajudam a verificar o aviso.</p>
    </article>
    <div class="clues evidence-grid">${evidence.map(({ label }, index) =>
      '<button type="button" data-evidence="' + index + '" aria-pressed="false">' + label + '</button>').join('')}</div>
    <article class="game-card">
      <h3 id="evidence-title"></h3>
      <p id="evidence-detail" aria-live="polite"></p>
      <button class="choice-action" id="pin">Fixar pista</button>
    </article>
    <p class="stage-tip" id="dossier-count"></p>
    <div class="stage-actions"><button class="primary" id="verify">Cruzar com a fonte oficial →</button></div>`;
  const buttons = all('[data-evidence]');
  const pin = $('#pin');
  const verify = $('#verify');

  function updateEvidence() {
    $('#evidence-title').textContent = evidence[selected].label;
    $('#evidence-detail').textContent = evidence[selected].detail;
    pin.textContent = pinned.has(selected) ? 'Retirar do dossiê' : 'Fixar no dossiê';
    $('#dossier-count').textContent = inspected.size + '/4 áreas examinadas · ' +
      pinned.size + '/3 espaços no dossiê' +
      (pinned.size ? ' · ' + [...pinned].map((index) => evidence[index].label).join(', ') : '');
    verify.disabled = pinned.size !== 3;
    buttons.forEach((button, index) => {
      button.classList.toggle('found', pinned.has(index));
      button.setAttribute('aria-pressed', selected === index);
    });
    setBar(inspected.size + pinned.size, 8);
  }

  buttons.forEach((button, index) => {
    button.onclick = () => {
      selected = index;
      inspected.add(index);
      updateEvidence();
    };
  });
  pin.onclick = () => {
    if (pinned.delete(selected)) {
      feedback('Pista retirada do dossiê.');
    } else if (pinned.size === 3) {
      feedback('Dossiê cheio. Retire uma pista para fixar outra.', 'warning');
    } else {
      pinned.add(selected);
      feedback('Pista fixada: ' + evidence[selected].label + '.');
    }
    updateEvidence();
  };
  verify.onclick = () => {
    if ([...pinned].some((index) => !evidence[index].valid)) {
      feedback('O dossiê ainda tem um dado de popularidade. Troque-o por uma pista sobre a origem ou o contexto do post.', 'warning');
      return;
    }
    stage.innerHTML = `
      <article class="mission-recap">
        <p class="kicker">Consulta simulada · Canal oficial</p>
        <h3 id="bulletin-title" tabindex="-1">O aviso original continua em vigor</h3>
        <p>O boletim atualizado confirma que a mudança anunciada no post não ocorreu. O dossiê liga a imagem viral a uma campanha antiga.</p>
      </article>`;
    setBar(1, 1);
    feedback('Dossiê validado. A publicação viral ficou marcada como enganosa.', 'success');
    showNext('Arquivar dossiê →', () => finishMission());
    focus('#bulletin-title');
  };
  inspected.add(selected);
  updateEvidence();
}

const usefulPosts = [
  ['Guia de checagem', 'Um passo a passo mostra autoria, data e fontes para consulta.'],
  ['Biblioteca do bairro', 'O perfil da biblioteca publica a programação com horário e link oficial.'],
  ['Como reconhecer publicidade', 'Uma oficina explica como identificar parcerias pagas e comparar informações.'],
  ['Panorama da semana', 'Um boletim assinado reúne links e mostra de onde vieram os dados.'],
  ['Oficina de segurança', 'A equipe do centro comunitário oferece um guia de proteção de contas.'],
  ['Projeto do bairro', 'Um relato reúne fotos datadas, autoria e endereço para acompanhar a iniciativa.'],
];
const noisyPosts = [
  ['Todo mundo já compartilhou', 'O post usa a popularidade como prova e pede que você repasse a mensagem.'],
  ['Última chance!', 'A oferta ameaça sumir a qualquer momento e esconde suas condições.'],
  ['Você vai ficar de fora?', 'Uma publicação pressiona você a comentar para fazer parte do grupo.'],
  ['Clique para descobrir', 'O título promete uma revelação, mas esconde o assunto e a autoria.'],
  ['Indignação em alta', 'Um corte de vídeo provoca raiva sem mostrar o que aconteceu antes.'],
  ['Aprovado por milhares', 'O anúncio cita números sem apresentar dados verificáveis.'],
];

function trainFeed() {
  const total = 6;
  let turn = 0;
  let signal = 0;
  let noise = 2;
  let useful = false;
  let usefulIndex = 0;
  let noisyIndex = 0;
  stage.innerHTML = `
    <p class="round-goal">Em 6 interações, chegue a 4 pontos de sinal útil e no máximo 1 de ruído.</p>
    <div class="stage-meter">
      <div><label for="signal">Sinal útil <b id="signal-value"></b></label><meter id="signal" min="0" max="6" value="0"></meter></div>
      <div><label for="noise">Ruído <b id="noise-value"></b></label><meter id="noise" min="0" max="8" value="2"></meter></div>
    </div>
    <article class="feed-card">
      <p class="kicker" id="feed-turn"></p>
      <h3 id="feed-title" tabindex="-1"></h3><p id="feed-text"></p>
    </article>
    <div class="stage-actions">
      <button class="choice-action" data-action="follow">Acompanhar</button>
      <button class="choice-action" data-action="skip">Passar</button>
      <button class="choice-action" data-action="mute">Ver menos</button>
    </div>`;

  function updateMeters() {
    $('#signal').value = signal;
    $('#signal-value').textContent = signal + '/6';
    $('#noise').value = noise;
    $('#noise-value').textContent = noise + '/8';
    setBar(turn, total);
  }

  function showPost() {
    const [title, copy] = useful ? usefulPosts[usefulIndex++] : noisyPosts[noisyIndex++];
    $('#feed-turn').textContent = 'RECOMENDAÇÃO ' + (turn + 1) + ' DE ' + total;
    $('#feed-title').textContent = title;
    $('#feed-text').textContent = copy;
  }

  const actions = all('[data-action]');
  actions.forEach((button) => {
    button.onclick = () => {
      const action = button.dataset.action;
      if (action === 'follow') {
        if (useful) {
          signal++;
          feedback('Sinal +1. O algoritmo prioriza publicações parecidas.', 'success');
        } else {
          noise++;
          feedback('Ruído +1. O algoritmo leu seu clique como interesse.', 'warning');
        }
      } else if (action === 'mute') {
        if (useful) {
          signal = Math.max(0, signal - 1);
          useful = false;
          feedback('Você pediu menos conteúdo desse tipo. A próxima sugestão muda de categoria.', 'warning');
        } else {
          noise = Math.max(0, noise - 2);
          useful = true;
          feedback('Ruído reduzido. O algoritmo vai testar uma sugestão diferente.', 'success');
        }
      } else {
        useful = !useful;
        feedback('Você seguiu sem interagir. O feed testará outra categoria.');
      }
      turn++;
      updateMeters();
      if (turn < total) {
        showPost();
        focus('#feed-title');
      } else if (signal >= 4 && noise <= 1) {
        finishMission('Feed recuperado: ' + signal + ' de sinal útil e ' + noise + ' de ruído.');
      } else {
        actions.forEach((choice) => { choice.disabled = true; });
        $('#feed-turn').textContent = 'SIMULAÇÃO ENCERRADA';
        $('#feed-title').textContent = 'Seu feed ainda precisa de ajuste';
        $('#feed-text').textContent = 'Use “Ver menos” quando a publicação tentar ganhar cliques pela pressão. Acompanhe fontes úteis para aumentar o sinal.';
        feedback('Resultado: ' + signal + ' de sinal útil e ' + noise + ' de ruído.', 'warning');
        showNext('Reiniciar simulação ↻', () => startMission('influence'));
        focus('#feed-title');
      }
    };
  });
  updateMeters();
  showPost();
}

const defenses = [
  ['Senha exclusiva', 'Use uma senha diferente para esta conta.'],
  ['Autenticação em dois fatores', 'Peça uma confirmação extra no login.'],
  ['Canal oficial', 'Abra o serviço pelo endereço conhecido.'],
  ['Perfil privado', 'Restrinja quem vê suas publicações.'],
  ['Modo anônimo', 'Evite guardar o histórico no navegador.'],
];
const attacks = [
  ['Vazamento em outro serviço', 'Senha exclusiva impediu o reaproveitamento da credencial.', 'Uma senha reutilizada poderia abrir acesso à conta.'],
  ['Senha descoberta', 'O segundo fator barrou a tentativa de login.', 'Faltou uma confirmação extra no login.'],
  ['Link falso de suporte', 'O acesso pelo canal oficial evitou o site falso.', 'Conferir pelo canal oficial evita abrir o link falso.'],
];

function defend() {
  const equipped = new Set();
  stage.innerHTML = `
    <p class="round-goal">Equipe três recursos para bloquear vazamento de senha, tentativa de login e link falso.</p>
    <p class="stage-tip" id="defense-slots">0/3 defesas equipadas</p>
    <div class="shield-list">${defenses.map(([label, copy], index) =>
      '<button class="shield-item" data-defense="' + index + '" aria-pressed="false"><span>' +
      (index + 1) + '</span><b>' + label + '</b><small>' + copy + '</small><i aria-hidden="true">+</i></button>').join('')}</div>
    <div class="stage-actions"><button class="primary" id="test-defenses" disabled>Simular ataques →</button></div>
    <div id="attack-log"></div>`;
  const test = $('#test-defenses');
  const log = $('#attack-log');
  all('[data-defense]').forEach((button, index) => {
    button.onclick = () => {
      if (!equipped.has(index) && equipped.size === 3) {
        feedback('Os três espaços estão ocupados. Remova um recurso para trocar a defesa.', 'warning');
        return;
      }
      if (!equipped.delete(index)) equipped.add(index);
      const active = equipped.has(index);
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active);
      button.querySelector('i').textContent = active ? '✓' : '+';
      $('#defense-slots').textContent = equipped.size + '/3 defesas equipadas';
      test.disabled = equipped.size !== 3;
      log.replaceChildren();
      setBar(0, attacks.length);
      feedback(active ? 'Defesa equipada.' : 'Defesa removida.');
    };
  });
  test.onclick = () => {
    const blocked = attacks.filter((_, index) => equipped.has(index)).length;
    setBar(blocked, attacks.length);
    log.innerHTML = '<article class="mission-recap"><h3 id="attack-title" tabindex="-1">' +
      blocked + '/3 ameaças bloqueadas</h3><ul>' + attacks.map(([name, success, failure], index) =>
      '<li><b>' + name + '</b> · ' + (equipped.has(index) ? 'Bloqueado. ' + success : 'Vulnerável. ' + failure) + '</li>'
    ).join('') + '</ul></article>';
    if (blocked === attacks.length) {
      all('[data-defense]').forEach((button) => { button.disabled = true; });
      test.disabled = true;
      feedback('Conta protegida. As três defesas funcionaram.', 'success');
      showNext('Concluir missão →', () => finishMission('3 de 3 ameaças bloqueadas.'));
    } else {
      feedback('Ajuste seu equipamento e rode a simulação novamente.', 'warning');
    }
    focus('#attack-title');
  };
}

avatars.forEach((button) => {
  button.onclick = () => {
    avatar = button;
    write('name', avatar.dataset.name);
    write('avatar', avatar.dataset.avatar);
    updateHud();
  };
});
missionButtons.forEach((button) => {
  button.onclick = () => {
    if (activeMission === button.dataset.track) {
      focus('#question');
    } else {
      startMission(button.dataset.track);
    }
  };
});
$('#back-to-map').onclick = returnToMap;
$('#avatar-mini').onclick = () => focus('#profile-title');
$('#start').onclick = () => focus('#map-title');
$('#begin').onclick = () => {
  write('intro-seen', 'yes');
  $('#intro').close();
  focus('#profile-title');
};
$('#intro').addEventListener('cancel', () => write('intro-seen', 'yes'));
$('#message').value = read('reflection') || '';
$('#feedback-form').onsubmit = (event) => {
  event.preventDefault();
  const message = $('#message').value.trim();
  $('#form-status').textContent = !message ? 'Escreva uma reflexão antes de salvar.' :
    write('reflection', message) ? 'Reflexão salva neste dispositivo.' : 'O navegador bloqueou o salvamento.';
};
updateHud();
if (!read('intro-seen') && progress.done.size === 0) $('#intro').showModal();
