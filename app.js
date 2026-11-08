const missions = {
  news: {
    label: 'Boato no bairro',
    title: 'O detetive do feed',
    scene: 'DOSSIÊ 01 · PERÍCIA DE PUBLICAÇÃO',
    badge: 'Olhar crítico',
    victim: 'Moradores de Camaragibe',
    channel: 'Rede Social (Post Viral)',
    loupeHint: 'Golpistas e criadores de boatos usam palavras como "URGENTE" e "antes que apaguem" para ativar o medo e impedir que você cheque a data ou a fonte oficial. Curtidas mostram alcance, nunca veracidade.',
    recap: 'A imagem era antiga, a autoria era desconhecida e a pressão para compartilhar escondia a falta de contexto.',
    play: investigate,
  },
  timeline: {
    label: 'Checagem de informação',
    title: 'O recorte fora de hora',
    scene: 'DOSSIÊ 02 · MESA DE CRONOLOGIA',
    badge: 'Rastreador de contexto',
    victim: 'Mural Comunitário',
    channel: 'Arquivo de Jornal vs. Feed',
    loupeHint: 'Tirar um cartaz verdadeiro de época ou de outra cidade ("Vila do Farol, Ago/2024") é uma técnica clássica de desinformação. Sempre reconstrua a ordem das datas antes de repassar um alerta.',
    recap: 'O recorte veio de uma campanha antiga. A publicação recente alterou o contexto, e o boletim posterior desmentiu o aviso.',
    play: () => arrange('Monte a linha do tempo do aviso, do registro mais antigo ao mais recente.', [
      ['14 AGO · 09h', 'O jornal do bairro publica a imagem de uma campanha antiga.'],
      ['03 SET · 08h', 'Um perfil recorta a imagem e anuncia uma mudança para hoje.'],
      ['03 SET · 10h', 'O boletim oficial confirma que a mudança anunciada não ocorreu.'],
    ]),
  },
  influence: {
    label: 'Recomendações do feed',
    title: 'Por trás da tela',
    scene: 'DOSSIÊ 03 · MONITOR ALGORÍTMICO',
    badge: 'Leitura de feed',
    victim: 'Feed do Investigador',
    channel: 'Algoritmo de Recomendações',
    loupeHint: 'O algoritmo não julga se algo é seguro ou golpe: ele mede retenção e cliques. Se você clica em postagens alarmistas ou "ofertas milagrosas", a plataforma passa a entregar mais iscas parecidas.',
    recap: 'Suas interações mudaram as próximas sugestões. Na vida real, cada plataforma combina vários sinais para recomendar conteúdo.',
    play: trainFeed,
  },
  advertising: {
    label: 'Marketing e persuasão',
    title: 'O anúncio de cinco minutos',
    scene: 'DOSSIÊ 04 · BANCADA DE ANÚNCIOS',
    badge: 'Leitura de campanha',
    victim: 'Consumidores no Feed',
    channel: 'Anúncio Patrocinado Oculto',
    loupeHint: 'Cronômetros que reiniciam ao atualizar a página (falsa escassez) e patrocínios escondidos no meio de hashtags são gatilhos para forçar compras por impulso em lojas falsas.',
    recap: 'A contagem regressiva, a promessa de exclusividade e o patrocínio escondido indicam técnicas de persuasão. Avalie os termos e a identidade de quem anuncia antes de comprar.',
    play: editAd,
  },
  phishing: {
    label: 'Phishing e roubo de conta',
    title: 'O suporte que pediu o código',
    scene: 'DOSSIÊ 05 · LABORATÓRIO ANTI-PHISHING',
    badge: 'Perícia de e-mail',
    victim: 'Júlia (Conta Aurora)',
    channel: 'E-mail Forjado de Suporte',
    loupeHint: 'Compare sempre o domínio após o "@" (aurora-verifica.example vs conta-aurora.example), inspecione para onde o botão realmente aponta sem clicar nele e lembre-se: suporte legítimo JAMAIS pede código SMS de 6 dígitos.',
    recap: 'O domínio divergente, o botão que leva a outro endereço e o pedido de código sugerem phishing. Abra o serviço pelo canal conhecido e denuncie a mensagem suspeita.',
    play: () => inspectDocument({
      title: 'Sua conta será bloqueada hoje',
      email: true,
      prompt: 'Marque três evidências que justificam desconfiar deste e-mail.',
      fields: [
        ['Remetente', 'Suporte da Conta Aurora <alerta@aurora-verifica.example>', true],
        ['Horário de envio', '09h14', false],
        ['Prévia do botão “Reativar”', 'painel-de-acesso.example/aurora', true],
        ['Corpo da mensagem', 'Olá! Detectamos atividade incomum na sua conta. Para evitar o bloqueio, responda com o código de seis dígitos que chegou no seu celular.', true],
        ['Assinatura', 'Equipe de atendimento', false],
      ],
      reference: 'Na consulta independente, o canal da Conta Aurora usa conta-aurora.example. O histórico da conta não mostra bloqueio. O suporte oficial não solicita o código por e-mail.',
      comparison: 'Para comparar: uma mensagem esperada sobre um chamado que você abriu pode trazer o número do protocolo e orientar a consulta no aplicativo, sem pedir código. Confira se o protocolo aparece lá. Um nome conhecido no remetente, por si só, não autentica a mensagem.',
    }),
  },
  privacy: {
    label: 'Privacidade e resposta',
    title: 'Modo proteção',
    scene: 'DOSSIÊ 06 · CONSOLE DE BLINDAGEM',
    badge: 'Modo proteção',
    victim: 'Credenciais da Conta',
    channel: 'Terminal de Segurança',
    loupeHint: 'Perfil privado e modo anônimo ajudam na privacidade cotidiana, mas para barrar vazamento de senhas, invasão de login e phishing você precisa da tríade: Senha Exclusiva + 2FA + Canal Oficial.',
    recap: 'A senha exclusiva, o segundo fator e a verificação pelo canal oficial bloquearam ameaças diferentes.',
    play: defend,
  },
  inbox: {
    label: 'Fraudes por mensagem',
    title: 'Plantão de golpes',
    scene: 'DOSSIÊ 07 · CENTRAL DE INCIDENTES',
    badge: 'Verificação independente',
    victim: '5 Moradores em Alerta',
    channel: 'WhatsApp, SMS e E-mail',
    loupeHint: 'Todo golpe digital tenta manter você preso dentro da conversa falsa (pedindo sigilo ou pressa). A regra de ouro do detetive é sair do atalho recebido e verificar por um canal externo e independente.',
    recap: 'Você confirmou a identidade por um contato conhecido, verificou a situação da família, consultou o rastreio oficial e conferiu a atividade da conta sem usar os atalhos recebidos.',
    play: triage,
  },
  finale: {
    label: 'Reconstrução do caso',
    title: 'Operação Fio Vermelho',
    scene: 'DOSSIÊ 08 · QUADRO FIO VERMELHO',
    badge: 'Investigação integrada',
    victim: 'Rede Comunitária de Camaragibe',
    channel: 'Cruzamento Forense Total',
    loupeHint: 'Ouça o relato de Júlia no WhatsApp recuperado. Cruze os dois documentos que compartilham o domínio fraudulento "painel-de-acesso.example" e conecte a ameaça de bloqueio ao registro oficial que a desmente.',
    recap: 'O aviso reutilizado atraiu atenção, o anúncio pressionou a interação e o falso suporte tentou obter o código. Os documentos ligam os endereços à mesma operação, mas a identidade de quem está por trás continua em aberto.',
    play: connectEvidence,
  },
};

const routes = {
  Explorador: 'Olhar crítico · Fontes e contexto',
  Analista: 'Leitura de padrões · Dados e algoritmos',
  Estrategista: 'Influência · Emoções e persuasão',
  Guardião: 'Proteção · Privacidade e segurança',
};

const ranks = [
  'Detetive Estagiário',
  'Investigador de Campo',
  'Perito de Mídias',
  'Analista Forense',
  'Rastreador de Fraudes',
  'Especialista Anti-Phishing',
  'Inspetor de Segurança',
  'Delegado Cibernético',
  'Guardião Digital Chefe',
];

const $ = (selector) => document.querySelector(selector);
const all = (selector) => [...document.querySelectorAll(selector)];
const stage = $('#game-stage');
const result = $('#result');
const next = $('#next');
const missionIds = Object.keys(missions);
const avatars = all('.avatar-option');

// Synthesized Detective Audio Engine (Web Audio API)
let soundEnabled = true;
let audioCtx = null;

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'clue') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.11);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'stamp') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(58, now + 0.18);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'warn') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(185, now + 0.08);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch {
    // Ignore audio context restrictions
  }
}

$('#case-files').innerHTML = missionIds.map((id, index) => {
  const { title, label } = missions[id];
  return '<button class="mission" data-track="' + id + '"><span class="mission-num">' +
    String(index + 1).padStart(2, '0') + '</span><span><small>DOSSIÊ ' + String(index + 1).padStart(2, '0') + '</small><strong>' +
    title + '</strong><span class="mission-description">' + label +
    '</span><span class="mission-status"></span></span></button>';
}).join('');
const missionButtons = all('.mission');
const views = all('.game-view');
const viewButtons = all('[data-view]');
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

function available(id) {
  const index = missionIds.indexOf(id);
  return progress.done.has(id) || index === 0 || progress.done.has(missionIds[index - 1]);
}

function focus(selector) {
  const element = $(selector);
  if (!element) return;
  element.focus({ preventScroll: true });
  element.scrollIntoView({ block: 'nearest' });
}

function updateHud() {
  const { xp, done } = progress;
  const level = Math.min(missionIds.length + 1, Math.floor(xp / reward) + 1);
  const rankTitle = ranks[Math.min(ranks.length - 1, done.size)];
  $('#xp').textContent = xp;
  $('#level').textContent = 'Nível ' + level + ' · ' + rankTitle;
  if ($('#credential-rank')) {
    $('#credential-rank').textContent = 'Patente atual: Nível ' + level + ' — ' + rankTitle;
  }
  $('#xp-fill').style.width = (done.size === missionIds.length || level === missionIds.length + 1 ? 100 : (xp % reward) / reward * 100) + '%';
  $('#completed').textContent = done.size;
  $('#hud-stars').textContent = '★'.repeat(done.size) + '☆'.repeat(missionIds.length - done.size);
  $('#hud-stars').setAttribute('aria-label', done.size + ' de ' + missionIds.length + ' estrelas');
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
    button.disabled = !available(id);
    button.querySelector('.mission-status').textContent = complete
      ? '★ Arquivado · Reabrir'
      : activeMission === id ? '⌕ Em perícia' : button.disabled ? '🔒 Pasta lacrada' : '📌 Disponível · 60 XP';
    const skill = $('#skill-' + id);
    if (skill) {
      skill.classList.toggle('unlocked', complete);
      skill.querySelector('small').textContent = complete ? 'Desbloqueado ✓' : 'Bloqueado';
    }
  });
  const won = done.size === missionIds.length;
  $('.final-skill').classList.toggle('unlocked', won);
  $('.final-skill small').textContent = won ? 'Arquivo completo ✓' : 'Complete os oito casos';
  document.dispatchEvent(new Event('case-progress'));
}

function setBar(value, total) {
  $('#bar-fill').style.width = value / total * 100 + '%';
}

function showView(id) {
  views.forEach((view) => { view.hidden = view.id !== id; });
  viewButtons.forEach((button) => {
    button.setAttribute('aria-current', button.dataset.view === id ? 'true' : 'false');
  });
  $('#map-interact').hidden = id !== 'missao';
  if (id === 'missao') document.dispatchEvent(new Event('case-progress'));
}

function feedback(message = '', type = '') {
  result.textContent = message;
  result.classList.toggle('is-success', type === 'success');
  result.classList.toggle('is-warning', type === 'warning');
  if (type === 'success') playSound('clue');
  else if (type === 'warning') playSound('warn');
}

function showNext(label, action) {
  next.textContent = label;
  next.onclick = action;
  next.hidden = false;
}

function returnToMap() {
  activeMission = null;
  if ($('#loupe-drawer')) $('#loupe-drawer').hidden = true;
  if ($('#toggle-loupe')) $('#toggle-loupe').setAttribute('aria-pressed', 'false');
  showView('missao');
  updateHud();
  focus('#map-title');
}

function startMission(id) {
  if (!available(id)) return;
  playSound('click');
  const mission = missions[id];
  const caseNumber = String(missionIds.indexOf(id) + 1).padStart(2, '0');
  activeMission = id;
  showView('play');
  $('#map-radio').textContent = briefings[id];
  $('#mission-name').textContent = 'DOSSIÊ ' + caseNumber;
  $('#case-stage').textContent = '1/3 · Briefing';
  $('#folder-stamp').textContent = progress.done.has(id) ? 'ARQUIVADO · REABERTO' : 'SOB INVESTIGAÇÃO';
  $('#folder-stamp').classList.toggle('is-archived', progress.done.has(id));
  $('#scenario').textContent = mission.label.toUpperCase();
  $('#question').textContent = mission.title;
  $('#case-subtitle').textContent = 'Alvo da análise: ' + mission.channel + ' · Interesse: ' + mission.victim;
  $('#loupe-hint-text').textContent = mission.loupeHint;
  $('#loupe-drawer').hidden = true;
  $('#toggle-loupe').setAttribute('aria-pressed', 'false');
  next.hidden = true;
  feedback();
  setBar(0, 1);
  stage.innerHTML = `
    <article class="mission-recap briefing">
      <p class="kicker">Despacho de Campo · Inspetora Lia</p>
      <p>${briefings[id]}</p>
      <div class="briefing-grid">
        <div><strong>Pasta Forense</strong>Dossiê #${caseNumber} · Camaragibe</div>
        <div><strong>Vetor Analisado</strong>${mission.channel}</div>
        <div><strong>Insígnia em Jogo</strong>${mission.badge} (+60 XP)</div>
      </div>
    </article>`;
  showNext('Abrir mesa de evidências →', () => {
    playSound('clue');
    next.hidden = true;
    $('#case-stage').textContent = '2/3 · Perícia';
    $('#scenario').textContent = mission.scene;
    mission.play();
    focus('#question');
  });
  updateHud();
  focus('#question');
}

function finishMission(detail = '') {
  playSound('stamp');
  const id = activeMission;
  const mission = missions[id];
  activeMission = null;
  const saved = loadProgress();
  for (const completed of saved.done) progress.done.add(completed);
  progress.xp = Math.max(progress.xp, saved.xp);
  const firstClear = !progress.done.has(id);
  if (firstClear) {
    progress.done.add(id);
    progress.xp += reward;
  }
  const stored = write('progress', JSON.stringify({ xp: progress.xp, done: [...progress.done] }));
  const nextId = missionIds.find((candidate) => !progress.done.has(candidate));
  $('#map-radio').textContent = nextId ? 'Relatório carimbado. A próxima pasta do arquivo foi destravada.' : 'Operação Fio Vermelho concluída! Todos os 8 dossiês foram solucionados.';
  $('#scenario').textContent = nextId ? 'LAUDO PERICIAL CONCLUÍDO' : 'OPERAÇÃO FIO VERMELHO ENCERRADA';
  $('#case-stage').textContent = '3/3 · Relatório';
  $('#folder-stamp').textContent = 'CASO ARQUIVADO ✓';
  $('#folder-stamp').classList.add('is-archived');
  $('#question').textContent = nextId ? 'Evidências arquivadas com sucesso' : 'Credencial Máxima: Guardião Digital!';
  stage.innerHTML = '<article class="mission-recap"><p class="chapter-reward">★ ' +
    (firstClear ? '+60 XP · Insígnia: ' + mission.badge : 'Revisão pericial concluída') +
    '</p><p>' + mission.recap + '</p></article>';
  if (detail) {
    const summary = document.createElement('p');
    summary.textContent = 'Resumo do laudo: ' + detail;
    $('.mission-recap').append(summary);
  }
  setBar(1, 1);
  feedback(stored ? '' : 'O navegador bloqueou o salvamento. O progresso vale nesta sessão.', 'warning');
  showNext(nextId ? 'Abrir próximo dossiê →' : 'Voltar ao quadro tático →',
    nextId ? () => startMission(nextId) : returnToMap);
  updateHud();
  focus('#question');
}

const briefings = {
  news: 'Uma publicação viral diz que um aviso do bairro mudou. Examine o celular apreendido, separe três pistas no dossiê e consulte o boletim oficial.',
  timeline: 'A imagem do post também apareceu em um jornal antigo. Organize os recortes na mesa de cronologia para provar o que foi tirado de contexto.',
  influence: 'O perfil que espalhou o recorte apareceu em várias recomendações. Opere o monitor de escuta e veja como o feed reage aos seus cliques.',
  advertising: 'Uma oferta começou a aparecer junto com o conteúdo viral. Audite a peça na bancada para desarmar a falsa urgência e a publicidade oculta.',
  phishing: 'Quem abriu a oferta recebeu um e-mail de suporte. Inspecione o cabeçalho e o link oculto sem clicar, e compare com o canal oficial da conta.',
  privacy: 'O e-mail colocou a conta em risco de invasão. Equipe três defesas no terminal de segurança e rode o teste de resistência contra ataques.',
  inbox: 'Chegaram cinco alertas urgentes ao Plantão de Golpes: Pix de número novo, falso sequestro, SMS de entrega, e-mail falsificado e boleto adulterado. Faça a triagem por canais independentes.',
  finale: 'Hora de fechar a Operação Fio Vermelho. Ouça o áudio recuperado no WhatsApp e estique o fio vermelho no quadro de cortiça para provar o vínculo entre as fraudes.',
};

function inspectDocument({ title, prompt, fields, reference, comparison, email = false }) {
  const marked = new Set();
  const expected = fields.filter(([, , clue]) => clue).length;
  const documentHeading = email
    ? '<div class="mail-toolbar"><span>✉ Perícia de E-mail · Cabeçalho &amp; Links</span><span>EVIDÊNCIA 05–A</span></div>'
    : '<p class="paper-stamp">Captura de anúncio · Simulação</p><img class="ad-evidence-art" src="feed-art.svg#clock" alt="">';
  stage.innerHTML = '<p class="round-goal">' + prompt + '</p><article class="evidence-paper' +
    (email ? ' mail-client' : '') + '">' + documentHeading +
    '<h3></h3><div class="document-fields"></div></article>' +
    '<p class="stage-tip" id="marked-count"></p><div class="stage-actions"><button class="primary" id="compare-document" disabled>' +
    (email ? 'Anexar marcações ao dossiê →' : 'Conferir com registro independente →') + '</button></div>';
  $('.evidence-paper h3').textContent = title;
  const list = $('.document-fields');
  const compare = $('#compare-document');
  function updateMarks() {
    $('#marked-count').textContent = marked.size + '/' + expected + ' indícios marcados na evidência';
    compare.disabled = marked.size !== expected;
    setBar(marked.size, expected + 1);
  }
  fields.forEach(([label, copy], index) => {
    const button = document.createElement('button');
    const heading = document.createElement('strong');
    heading.textContent = label;
    button.className = 'document-field';
    if (email) button.classList.add('mail-part');
    button.setAttribute('aria-pressed', 'false');
    if (email && index === 2) {
      const preview = document.createElement('span');
      preview.className = 'mail-preview';
      preview.textContent = 'URL real oculta: ' + copy;
      preview.hidden = true;
      heading.textContent = '⌕ Botão “Reativar conta” · Clique para inspecionar URL sem abrir';
      button.append(heading, preview);
      button.onclick = () => {
        if (preview.hidden) {
          preview.hidden = false;
          heading.textContent = 'Destino do botão revelado · Clique novamente para marcar como pista';
          feedback('Lupa de link: o endereço aponta para "painel-de-acesso.example", fora do domínio oficial!', 'success');
          return;
        }
        toggleMark();
      };
    } else {
      button.append(heading, document.createTextNode(copy));
      button.onclick = toggleMark;
    }
    function toggleMark() {
      if (!marked.has(index) && marked.size === expected) {
        feedback('Retire uma marcação para examinar outra hipótese.', 'warning');
        return;
      }
      if (!marked.delete(index)) marked.add(index);
      button.setAttribute('aria-pressed', marked.has(index));
      playSound('click');
      feedback('');
      updateMarks();
    }
    list.append(button);
  });
  compare.onclick = () => {
    if ([...marked].some((index) => !fields[index][2])) {
      feedback('Uma marcação descreve um detalhe comum (como horário ou assinatura genérica). Marque apenas os 3 indícios de fraude.', 'warning');
      return;
    }
    if (email) {
      $('#case-stage').textContent = '2/3 · Verificação';
      $('#map-radio').textContent = 'Três indícios registrados. Agora confira a situação da conta por um caminho que você já conhece.';
      stage.insertAdjacentHTML('beforeend',
        '<article class="game-card verification"><h3 id="verification-title" tabindex="-1">Como o detetive deve confirmar a autenticidade do aviso?</h3>' +
        '<div class="stage-actions"><button class="choice-action" id="reply-mail">Responder ao remetente pedindo confirmação</button>' +
        '<button class="primary" id="official-channel">Acessar o app/site oficial de forma independente →</button></div></article>');
      compare.disabled = true;
      list.querySelectorAll('button').forEach((button) => { button.disabled = true; });
      $('#reply-mail').onclick = () => feedback('Responder mantém o contato com o golpista. Confira a conta por um canal oficial que você já usa.', 'warning');
      $('#official-channel').onclick = showComparison;
      feedback('Evidências anexadas ao dossiê! Escolha o protocolo seguro de verificação.', 'success');
      focus('#verification-title');
      return;
    }
    showComparison();
  };
  function showComparison() {
    feedback('');
    stage.innerHTML = '<article class="evidence-paper"><p class="paper-stamp">Conferência Forense Concluída</p><h3 id="comparison-title" tabindex="-1">O que o registro oficial confirma</h3><p></p></article>';
    $('.evidence-paper p:last-child').textContent = reference;
    if (comparison) {
      const example = document.createElement('p');
      example.textContent = comparison;
      $('.evidence-paper').append(example);
    }
    setBar(1, 1);
    showNext('Carimbar e arquivar perícia →', () => finishMission());
    focus('#comparison-title');
  }
  updateMarks();
}

function editAd() {
  const changes = new Set();
  const edits = [
    ['Exigir identificação de patrocínio', 'PUBLICIDADE · Parceria paga: Loja Estação', 'Patrocínio oculto após 30 hashtags'],
    ['Desarmar cronômetro de falsa urgência', 'Oferta válida enquanto durar o estoque · Confira regras', '⏱ RESTAM 05:00! (Reinicia ao atualizar a página)'],
    ['Exibir dados do vendedor e condições', 'Loja Estação (CNPJ verificado) · Preço, frete e trocas visíveis', 'Oferta secreta só para escolhidos · Compre no link já!'],
  ];
  stage.innerHTML = `
    <p class="round-goal">Audite a peça publicitária apreendida: acione os três filtros periciais para remover os gatilhos enganosos e liberar uma comunicação transparente.</p>
    <div class="feed-lab">
      <article class="evidence-paper ad-workbench">
        <img class="ad-evidence-art" src="feed-art.svg#clock" alt="">
        <p class="paper-stamp" id="ad-0"></p>
        <h3 id="ad-1"></h3><p id="ad-2"></p>
      </article>
      <section class="algorithm-board"><p class="kicker">Bancada de Auditoria de Marketing</p>
        <div class="verdict-actions">${edits.map(([label], index) => '<button class="choice-action" data-edit-ad="' + index + '" aria-pressed="false">⌕ ' + label + '</button>').join('')}</div>
        <button class="primary" id="publish-ad" disabled>Carimbar peça auditada →</button>
      </section>
    </div>`;
  const controls = all('[data-edit-ad]');
  const publish = $('#publish-ad');
  function preview() {
    controls.forEach((control, index) => {
      const enabled = changes.has(index);
      control.setAttribute('aria-pressed', enabled);
      $('#ad-' + index).textContent = edits[index][enabled ? 1 : 2];
    });
    publish.disabled = changes.size !== edits.length;
    setBar(changes.size, edits.length);
  }
  controls.forEach((control, index) => {
    control.onclick = () => {
      if (!changes.delete(index)) changes.add(index);
      playSound('clue');
      preview();
    };
  });
  publish.onclick = () => finishMission('A nova peça identifica a publicidade claramente e mostra onde consultar as condições reais da oferta.');
  preview();
}

const incidents = [
  [
    'WhatsApp',
    'Número desconhecido (+55 81 9xxxx-xxxx)',
    'Oi, mãe! Troquei de número agora pouco.',
    'Me faz um Pix urgente de R$ 480? Meu app do banco bloqueou neste aparelho novo e preciso pagar um fornecedor agora!',
    'Ligar por voz/vídeo para o número antigo já salvo na agenda',
    'O familiar atende no número antigo e confirma que não trocou de chip nem pediu Pix.',
    'Foto de perfil e nome podem ser copiados em segundos. Sempre ligue para o número que você já tinha salvo antes de transferir.',
    'Indícios: Número fora da agenda + pedido urgente de Pix + desculpa para não atender ligação.',
  ],
  [
    'WhatsApp',
    'Contato sem identificação · Chamada/Mensagem',
    'Estamos com seu irmão aqui. Faça um Pix agora se quiser vê-lo bem.',
    'Não desligue e não avise ninguém, estamos vigiando você!',
    'Acionar a polícia (190) e pedir ajuda para localizar o familiar em paralelo',
    'A equipe faz a checagem em paralelo: o familiar estava seguro no trabalho e o número fazia disparos em massa.',
    'Golpistas usam ameaças e exigem que a vítima não desligue para impedir que ela cheque onde o familiar está. Em risco real, acione o 190.',
    'Indícios: Pressão psicológica extrema + exigência de sigilo absoluto + cobrança imediata via Pix.',
  ],
  [
    'SMS',
    'Central de Entregas · Pacote Retido',
    'AVISO URGENTE: Sua encomenda foi retida na triagem por pendência de taxa.',
    'Regularize em até 2h em entregas-pendentes.example/liberar para evitar devolução.',
    'Fechar o SMS e consultar o rastreio diretamente no app oficial da loja',
    'O aplicativo oficial da loja mostra que o pacote segue em trânsito normal, sem nenhuma taxa extra.',
    'Transportadoras e Correios não cobram taxas por links soltos de SMS. Sempre consulte o pedido dentro do aplicativo onde realizou a compra.',
    'Indícios: Link externo suspeito (smishing) + prazo curtíssimo de 2h + cobrança inesperada.',
  ],
  [
    'E-mail',
    'De: eu@exemplo.example (Remetente idêntico ao seu)',
    'Eu invadi seu dispositivo e acessei sua conta. Transfira o valor exigido em 24h.',
    'Olhe o campo “De:” — enviei esta mensagem de dentro do seu próprio e-mail.',
    'Abrir o provedor oficial de e-mail e conferir o histórico real de sessões/logins',
    'A perícia no provedor comprova que não houve login invasor: o golpista apenas falsificou o cabeçalho de exibição (spoofing).',
    'O campo "De:" de um e-mail pode ser falsificado como o remetente de uma carta de papel. Verifique os acessos recentes e mantenha o 2FA ativo.',
    'Indícios: Falsificação de cabeçalho (E-mail Spoofing) + extorsão sem prova real + intimidação.',
  ],
  [
    'E-mail',
    'Setor de Cobrança · Fatura Atualizada',
    'Comunicado: O boleto enviado anteriormente teve erro de leitura e foi cancelado.',
    'Realize o pagamento exclusivamente pela nova guia anexa: segunda-via-atualizada.pdf',
    'Conferir a fatura diretamente na área oficial do cliente/aplicativo da empresa',
    'No portal oficial da empresa, a fatura original continua válida e o CNPJ do anexo pertencia a uma conta laranja.',
    'Sempre emita a 2ª via no site/app oficial e confira o nome e CNPJ do beneficiário na tela do banco antes de digitar a senha.',
    'Indícios: Troca repentina de boleto por anexo + beneficiário divergente do credor original.',
  ],
];

function triage() {
  let incident = 0;
  function openIncident() {
    const [channel, sender, first, second, safe, outcome, lesson, redflags] = incidents[incident];
    const choices = [
      '<button class="choice-action" id="incident-reply">✗ ' + ['Responder na conversa e pedir a chave Pix', 'Fazer o Pix imediatamente pelo medo', 'Clicar no link do SMS para pagar a taxa', 'Responder ao e-mail tentando negociar', 'Pagar o boleto em PDF recebido no anexo'][incident] + '</button>',
      '<button class="choice-action" id="incident-check">✓ ' + safe + '</button>',
    ];
    if (incident % 2) choices.reverse();
    next.hidden = true;
    feedback('');
    setBar(incident, incidents.length);
    stage.innerHTML = `
      <div class="feed-lab">
        <article class="chat-evidence incident-screen">
          <div class="chat-head">
            <div><strong>${sender}</strong><small>${channel} apreendido · Ocorrência ${incident + 1} de ${incidents.length}</small></div>
            <span class="incident-badge">ALERTA #0${incident + 1}</span>
          </div>
          <div class="chat-thread">
            <p>${first}</p>
            <p>${second}</p>
            ${channel === 'SMS' ? '<button class="choice-action" id="incident-preview">⌕ Inspecionar URL com Lupa Forense</button><p id="incident-destination" hidden><strong>Análise de URL:</strong> O domínio "entregas-pendentes.example" foi registrado há 2 dias e imita uma página de pagamento.</p>' : ''}
          </div>
          <p class="forensic-redflags"><strong>⌕ Raio-X Pericial:</strong> ${redflags}</p>
        </article>
        <section class="algorithm-board">
          <p class="kicker">Mesa de Triagem · Plantão de Golpes</p>
          <h3 id="incident-title" tabindex="-1">Qual protocolo de verificação você aciona?</h3>
          <div class="verdict-actions">${choices.join('')}</div>
          <div class="incident-report" id="incident-report" hidden></div>
        </section>
      </div>`;
    if (channel === 'SMS') {
      $('#incident-preview').onclick = () => {
        $('#incident-destination').hidden = false;
        $('#incident-preview').disabled = true;
        playSound('clue');
        focus('#incident-check');
      };
    }
    $('#incident-reply').onclick = () => feedback('Armadilha! Agir dentro do canal ou atalho enviado pelo suspeito expõe seus dados e seu dinheiro. Verifique por fora!', 'warning');
    $('#incident-check').onclick = () => {
      $('#incident-reply').disabled = true;
      $('#incident-check').disabled = true;
      const report = $('#incident-report');
      report.innerHTML = '<strong>Laudo #' + (incident + 1) + ' — Golpe Neutralizado:</strong> ' + outcome + '<br><br><strong>Como se proteger:</strong> ' + lesson;
      report.hidden = false;
      feedback('Verificação independente concluída com sucesso!', 'success');
      setBar(incident + 1, incidents.length);
      showNext(incident + 1 === incidents.length ? 'Carimbar e arquivar plantão →' : 'Próxima ocorrência do plantão →', () => {
        incident++;
        if (incident === incidents.length) finishMission(incidents.length + ' golpes digitais neutralizados por verificação independente.');
        else openIncident();
      });
      next.focus();
    };
    focus('#incident-title');
  }
  openIncident();
}

function connectEvidence() {
  const fragments = [
    ['Evidência 04-A · Página da Oferta', 'O formulário de promoção coletou o e-mail de Júlia no domínio painel-de-acesso.example.'],
    ['Evidência 05-B · Registro Oficial', 'O servidor legítimo da Conta Aurora confirma que não houve bloqueio nem envio de código.'],
    ['Evidência 05-A · Botão do Falso Suporte', 'A inspeção de link revelou que o e-mail falso também aponta para painel-de-acesso.example.'],
    ['Evidência 05-C · Ameaça de Bloqueio', 'A mensagem fraudulenta alega bloqueio iminente e exige o código SMS de 6 dígitos.'],
  ];
  const pairs = new Set(['0:2', '1:3']);
  const linked = new Set();
  let selected = null;
  stage.innerHTML = witnessChat() + `
    <p class="round-goal">No Quadro de Cortiça abaixo, clique em dois documentos para esticar o <strong>Fio Vermelho</strong>: (1) una as duas provas que compartilham o mesmo domínio fraudulento e (2) una a ameaça de bloqueio ao registro oficial que a desmente.</p>
    <div class="corkboard-stage" id="corkboard-stage">
      <svg class="red-string-svg" id="red-string-svg" viewBox="0 0 600 320" preserveAspectRatio="none" aria-hidden="true"></svg>
      <div class="record-grid">${fragments.map(([title, detail], index) =>
        '<button class="evidence-paper record" data-link="' + index + '" aria-pressed="false"><strong>' + title + '</strong>' + detail + '</button>').join('')}</div>
    </div>
    <ol id="connections" class="connection-list"></ol>
    <button class="primary" id="file-connections" disabled>Carimbar Dossiê Final · Encerrar Operação →</button>`;
  wireWitness();
  const cards = all('[data-link]');
  const svg = $('#red-string-svg');

  function renderStrings() {
    if (!svg) return;
    const coords = {
      '0:2': [150, 75, 150, 240],
      '1:3': [450, 75, 450, 240],
    };
    svg.innerHTML = [...linked].map((key) => {
      const [x1, y1, x2, y2] = coords[key] || [100, 100, 300, 200];
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#d93829" stroke-width="5" stroke-linecap="round" />
              <circle cx="${x1}" cy="${y1}" r="7" fill="#ffdf9e" stroke="#9e2a1f" stroke-width="3" />
              <circle cx="${x2}" cy="${y2}" r="7" fill="#ffdf9e" stroke="#9e2a1f" stroke-width="3" />`;
    }).join('');
  }

  cards.forEach((card, index) => {
    card.onclick = () => {
      if (selected === null) {
        selected = index;
        card.setAttribute('aria-pressed', 'true');
        playSound('click');
        feedback('Pino fixado no primeiro documento. Agora clique no documento que forma par probatório com ele.');
        return;
      }
      const first = selected;
      selected = null;
      cards[first].setAttribute('aria-pressed', 'false');
      if (first === index) {
        feedback('Seleção desfeita.');
        return;
      }
      const key = [first, index].sort((a, b) => a - b).join(':');
      if (!pairs.has(key)) {
        feedback('Vínculo incorreto: compare os dois documentos que citam "painel-de-acesso.example" e os dois que tratam do suposto bloqueio.', 'warning');
        return;
      }
      linked.add(key);
      cards[first].disabled = true;
      card.disabled = true;
      renderStrings();
      const line = document.createElement('li');
      line.textContent = '📌 Fio Vermelho conectado: ' + fragments[first][0] + ' ↔ ' + fragments[index][0];
      $('#connections').append(line);
      const archive = $('#file-connections');
      archive.disabled = linked.size !== pairs.size;
      (cards.find((item) => !item.disabled) || archive).focus();
      setBar(linked.size, pairs.size);
      feedback('Fio vermelho esticado! Vínculo forense comprovado.', 'success');
    };
  });
  $('#file-connections').onclick = () => finishMission('Domínio fraudulento cruzado e falso bloqueio desmentido pelo servidor oficial.');
}

function witnessChat() {
  return `
    <details class="chat-evidence" open>
      <summary>▣ Evidência 08–A · Conversa Recuperada do Grupo do Bairro (WhatsApp Simulado)</summary>
      <div class="chat-head"><strong>Grupo dos Moradores · Camaragibe</strong><small>Exportação forense · Áudio transcrito</small></div>
      <div class="chat-thread">
        <p><b>Rafa</b>Alguém viu esse aviso? A postagem manda abrir uma oferta exclusiva.<small>08:11</small></p>
        <p class="chat-out"><b>Júlia</b>Eu abri. A página pediu meu e-mail para mandar a confirmação.<small>08:14</small></p>
        <p><b>Rafa</b>E o que veio na confirmação?<small>08:15</small></p>
        <p class="chat-out"><b>Júlia · Mensagem de voz (0:14)</b><button id="play-witness" class="choice-action" type="button">▶ Ouvir gravação de voz</button><small id="witness-status" role="status"></small>
          <span id="witness-text">Depois de cadastrar meu e-mail, recebi uma mensagem que dizia ser do suporte. O botão apontava para o mesmo endereço da oferta e o texto pedia o código de acesso.</span><small>08:17 · Transcrição pericial</small></p>
      </div>
    </details>`;
}

function wireWitness() {
  const playWitness = $('#play-witness');
  let reading = false;
  playWitness.onclick = () => {
    const status = $('#witness-status');
    if (!window.speechSynthesis || typeof SpeechSynthesisUtterance !== 'function') {
      status.textContent = 'Leitura em voz indisponível neste navegador. Confira a transcrição pericial abaixo.';
      return;
    }
    const speech = window.speechSynthesis;
    if (reading) {
      speech.cancel();
      reading = false;
      playWitness.textContent = '▶ Ouvir gravação de voz';
      status.textContent = 'Áudio pausado.';
      return;
    }
    const voice = new SpeechSynthesisUtterance($('#witness-text').textContent);
    voice.lang = 'pt-BR';
    const portuguese = speech.getVoices().find((option) => option.lang.toLowerCase() === 'pt-br');
    if (portuguese) voice.voice = portuguese;
    function completePlayback(message) {
      if (!reading) return;
      reading = false;
      playWitness.textContent = '▶ Ouvir gravação de voz';
      status.textContent = message;
    }
    voice.onend = () => completePlayback('Fim da gravação.');
    voice.onerror = () => completePlayback('Áudio indisponível. Leia a transcrição abaixo.');
    reading = true;
    playWitness.textContent = '■ Parar gravação';
    status.textContent = 'Reproduzindo depoimento de Júlia…';
    speech.speak(voice);
  };
}

function arrange(prompt, records) {
  const order = [];
  const shuffled = [2, 0, 1, 3].filter((index) => index < records.length);
  stage.innerHTML = '<p class="round-goal">' + prompt + '</p><div class="record-grid"></div>' +
    '<article class="chronology-board"><h3>Linha do Tempo no Dossiê (1º → 2º → 3º)</h3><ol id="record-order"></ol></article>' +
    '<div class="stage-actions"><button class="choice-action" id="undo-record" disabled>Retirar último recorte</button>' +
    '<button class="primary" id="verify-order" disabled>Validar linha do tempo →</button></div>';
  const buttons = new Map();
  const undo = $('#undo-record');
  const verify = $('#verify-order');
  function updateOrder() {
    $('#record-order').replaceChildren(...records.map((_, position) => {
      const entry = document.createElement('li');
      const index = order[position];
      entry.textContent = index === undefined ? 'Posição ' + (position + 1) + ' (Vazia)' : '📌 ' + records[index][0];
      entry.className = index === undefined ? 'empty-record' : 'placed-record';
      return entry;
    }));
    buttons.forEach((button, index) => { button.disabled = order.includes(index); });
    undo.disabled = order.length === 0;
    verify.disabled = order.length !== records.length;
    setBar(order.length, records.length + 1);
  }
  shuffled.forEach((index) => {
    const [label, copy] = records[index];
    const button = document.createElement('button');
    button.className = 'evidence-paper record';
    const heading = document.createElement('strong');
    const thumbnail = document.createElement('img');
    thumbnail.className = 'timeline-thumb';
    thumbnail.src = ['feed-art.svg#news', 'aviso.svg', 'feed-art.svg#search'][index];
    thumbnail.alt = '';
    heading.textContent = label;
    button.append(thumbnail, heading, document.createTextNode(copy));
    button.onclick = () => {
      order.push(index);
      updateOrder();
      feedback('Recorte fixado na cronologia: ' + label + '.', 'success');
      ([...buttons.values()].find((candidate) => !candidate.disabled) || verify).focus();
    };
    buttons.set(index, button);
    $('.record-grid').append(button);
  });
  undo.onclick = () => {
    const index = order.pop();
    updateOrder();
    buttons.get(index).focus();
    feedback('Último registro retirado.');
  };
  verify.onclick = () => {
    const mismatch = order.findIndex((index, position) => index !== position);
    if (mismatch !== -1) {
      feedback('Inconsistência temporal na posição ' + (mismatch + 1) + '. Observe o mês (AGO vs SET) e a hora (08h vs 10h).', 'warning');
      return;
    }
    finishMission('Cronologia reconstituída: o cartaz de agosto foi recortado às 08h e desmentido às 10h.');
  };
  updateOrder();
}

const evidence = [
  { label: 'Perfil', detail: 'Radar Agora republicou a imagem sem identificar nenhum órgão oficial nem autor do comunicado.', valid: true },
  { label: 'Imagem', detail: 'O arquivo original mostra no rodapé que o cartaz era de outra cidade (Vila do Farol, Ago/2024).', valid: true },
  { label: 'Legenda', detail: 'Usa caixa alta ("URGENTE") e ameaça de exclusão ("antes que apaguem") para impedir a checagem.', valid: true },
  { label: 'Reações', detail: 'O post soma 2,4 mil curtidas. Engajamento alto mede apenas viralização, não comprova veracidade.', valid: false },
];

function investigate() {
  const inspected = new Set();
  const pinned = new Set();
  let selected = null;
  let compared = false;
  stage.innerHTML = `
    <div class="forensics">
      <article class="evidence-phone" aria-label="Celular com publicação apreendida">
        <div class="phone-top"><span>📱 EVIDÊNCIA 01-A</span><span>09:14 · 4G ▰</span></div>
        <button class="hotspot phone-profile" data-evidence="0" aria-pressed="false"><span class="network-avatar" aria-hidden="true">R</span><span><b>Radar Agora</b><small>@radaragora · há 12 min · Sem selo oficial</small></span></button>
        <button class="hotspot phone-photo" data-evidence="1" aria-pressed="false" aria-label="Examinar a imagem da publicação">
          <img src="aviso.svg" alt="Cartaz com o título Aviso à comunidade, recortado na parte inferior">
          <span class="photo-loupe" aria-hidden="true">⌕ Passar Lupa</span>
        </button>
        <button class="hotspot phone-caption" data-evidence="2" aria-pressed="false"><strong>URGENTE: o aviso mudou!</strong>Compartilhe rápido antes que apaguem!</button>
        <button class="hotspot phone-reactions" data-evidence="3" aria-pressed="false">♡ 2,4 mil curtidas <span>↗ 890 compartilhamentos</span></button>
      </article>
      <div class="forensics-board">
        <p class="kicker">Mesa de Perícia · Evidência 01</p>
        <h3 id="evidence-title">Passe a lupa nos 4 elementos do celular</h3>
        <p id="evidence-detail" aria-live="polite">Clique em cada parte da postagem ao lado para inspecionar e fixe no dossiê as 3 pistas que comprovam manipulação.</p>
        <div id="photo-archive" class="photo-archive" hidden>
          <button class="choice-action" id="compare-photo">⌕ Recuperar arquivo sem recorte no banco de imagens →</button>
          <figure id="original-photo" hidden><img src="aviso.svg" alt=""><figcaption><strong>Metadados revelados:</strong> Cartaz original de Vila do Farol (Agosto de 2024) — rodapé foi cortado no post viral.</figcaption></figure>
        </div>
        <button class="choice-action" id="pin" hidden>📌 Fixar pista no dossiê</button>
        <div class="dossier">
          <p class="kicker">Dossiê do Caso 01 (3 evidências necessárias)</p>
          <ol id="dossier-slots" aria-label="Pistas no dossiê"></ol>
          <p class="stage-tip" id="dossier-count"></p>
          <button class="primary" id="verify">Cruzar dossiê com Boletim Oficial →</button>
        </div>
      </div>
    </div>`;
  const buttons = all('[data-evidence]');
  const pin = $('#pin');
  const verify = $('#verify');

  function updateEvidence() {
    if (selected !== null) {
      $('#evidence-title').textContent = 'Análise: ' + evidence[selected].label;
      $('#evidence-detail').textContent = selected === 1 && !compared
        ? 'A imagem publicada no feed está com a borda inferior cortada. Acione a busca no arquivo para ver o documento inteiro.'
        : evidence[selected].detail;
    }
    $('#photo-archive').hidden = selected !== 1;
    $('#original-photo').hidden = !compared;
    $('#compare-photo').hidden = compared;
    pin.hidden = selected === null || (selected === 1 && !compared);
    pin.textContent = pinned.has(selected) ? 'Retirar pista do dossiê' : '📌 Fixar pista no dossiê';
    const slots = [...pinned].map((index) => evidence[index].label);
    $('#dossier-slots').replaceChildren(...Array.from({ length: 3 }, (_, index) => {
      const slot = document.createElement('li');
      slot.textContent = slots[index] ? '📌 ' + slots[index] : 'Espaço ' + (index + 1);
      slot.className = slots[index] ? 'pinned' : '';
      return slot;
    }));
    $('#dossier-count').textContent = inspected.size + '/4 áreas periciadas · ' +
      pinned.size + '/3 pistas fixadas' +
      (pinned.size ? ' (' + [...pinned].map((index) => evidence[index].label).join(', ') + ')' : '');
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
      playSound('click');
      updateEvidence();
    };
  });
  $('#compare-photo').onclick = () => {
    compared = true;
    playSound('clue');
    updateEvidence();
    pin.focus();
  };
  pin.onclick = () => {
    if (pinned.delete(selected)) {
      feedback('Pista retirada do dossiê.');
    } else if (pinned.size === 3) {
      feedback('O dossiê comporta 3 provas. Retire uma antes de substituir.', 'warning');
    } else {
      pinned.add(selected);
      feedback('Pista anexada ao dossiê: ' + evidence[selected].label + '.', 'success');
    }
    updateEvidence();
  };
  verify.onclick = () => {
    if ([...pinned].some((index) => !evidence[index].valid)) {
      feedback('Atenção, detetive: o número de curtidas ("Reações") mede apenas popularidade, não é prova de fraude. Substitua por uma pista sobre autoria, imagem ou legenda!', 'warning');
      return;
    }
    stage.innerHTML = `
      <div class="verdict-board">
        <article class="evidence-paper official-bulletin">
          <p class="paper-stamp">Registro Oficial 01–B · Prefeitura / Comunidade</p>
          <h3 id="bulletin-title" tabindex="-1">Boletim Oficial da Comunidade</h3>
          <p class="bulletin-date">CANAL VERIFICADO · ATUALIZADO ÀS 10H</p>
          <p>O aviso publicado no mural do bairro continua em vigor. Nenhuma alteração urgente foi anunciada hoje.</p>
          <p>A perícia confirma que o cartaz em circulação nas redes sociais pertence a uma campanha antiga de Vila do Farol (Agosto de 2024).</p>
        </article>
        <section class="forensics-board" aria-labelledby="verdict-title">
          <p class="kicker">Veredito Pericial</p>
          <h3 id="verdict-title">Qual conclusão o seu dossiê sustenta?</h3>
          <ul class="verdict-clues">
            <li>Perfil sem vínculo com a fonte oficial</li>
            <li>Imagem recortada de outro município (Ago/2024)</li>
            <li>Legenda alarmista para forçar compartilhamento sem checagem</li>
          </ul>
          <div class="verdict-actions">
            <button class="choice-action" data-verdict="confirm">A mudança urgente foi confirmada pelo boletim</button>
            <button class="choice-action" data-verdict="unknown">Não há elementos suficientes para decidir</button>
            <button class="choice-action" data-verdict="misleading">✓ A publicação é enganosa e usa recorte fora de contexto</button>
          </div>
        </section>
      </div>`;
    $('#case-stage').textContent = '2/3 · Veredito';
    setBar(7, 8);
    feedback('Boletim oficial localizado! Cruze o documento com suas 3 pistas para dar o veredito.', 'success');
    all('[data-verdict]').forEach((button) => {
      button.onclick = () => {
        if (button.dataset.verdict === 'confirm') {
          feedback('Releia o boletim oficial: ele afirma expressamente que nenhuma mudança ocorreu hoje.', 'warning');
          return;
        }
        if (button.dataset.verdict === 'unknown') {
          feedback('O boletim oficial e o cartaz original de 2024 já comprovam a adulteração de contexto.', 'warning');
          return;
        }
        finishMission('Veredito registrado: a publicação viral enganava ao recortar um cartaz antigo de outro município.');
      };
    });
    focus('#bulletin-title');
  };
  updateEvidence();
}

const usefulPosts = [
  ['Guia de checagem em 3 passos', 'Um passo a passo mostra como conferir autoria, data original e canais oficiais antes de repassar.'],
  ['Biblioteca Comunitária de Camaragibe', 'O perfil verificado da biblioteca publica a agenda da semana com horário e portal oficial.'],
  ['Como identificar anúncios ocultos', 'Oficina de Marketing explica como reconhecer parcerias pagas e falsos contadores de escassez.'],
  ['Boletim da Semana Assinado', 'Relatório comunitário traz autoria identificada, data completa e links diretos para documentos públicos.'],
  ['Alerta de Segurança: Proteção de Contas', 'Guia prático do polo mostra como ativar o segundo fator (2FA) e evitar phishing no WhatsApp.'],
  ['Mutirão de Letramento Digital', 'Registro com fotos datadas, equipe responsável e endereço aberto para consulta pública.'],
];
const noisyPosts = [
  ['Todo mundo já compartilhou!', 'O post usa pressão de grupo como única "prova" e exige que você repasse imediatamente.'],
  ['ÚLTIMA CHANCE: Só pelos próximos 3 minutos!', 'Oferta milagrosa esconde o CNPJ da loja e usa urgência extrema para impedir pesquisa.'],
  ['Você vai ficar de fora dessa lista secreta?', 'Publicação caça-cliques pede dados nos comentários para liberar um suposto benefício.'],
  ['Clique urgente antes que tirem do ar!', 'Título sensacionalista promete revelação chocante, mas oculta a fonte e leva a site externo.'],
  ['Indignação total no bairro!', 'Corte de vídeo de 10 segundos provoca raiva sem mostrar a data nem o que aconteceu antes.'],
  ['Aprovado por 99% das pessoas!', 'Anúncio cita estatísticas inventadas sem apresentar nenhuma fonte verificável.'],
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
    <p class="round-goal">Missão no Monitor Algorítmico: em 6 interações, alcance pelo menos <strong>4 pontos de Sinal Útil</strong> e reduza o <strong>Ruído a no máximo 1 ponto</strong>. Use <em>“Ver menos”</em> para cortar iscas sensacionalistas e <em>“Acompanhar”</em> em fontes verificáveis.</p>
    <div class="feed-lab">
      <article class="feed-card social-post">
        <div class="social-top"><span class="network-avatar" aria-hidden="true">◉</span><p class="kicker" id="feed-turn"></p></div>
        <div class="feed-cover" id="feed-cover" aria-hidden="true"><img id="feed-illustration" src="feed-art.svg#library" alt=""></div>
        <div class="social-copy"><h3 id="feed-title" tabindex="-1"></h3><p id="feed-text"></p></div>
        <div class="stage-actions">
          <button class="choice-action" data-action="follow"><span aria-hidden="true">＋</span> Acompanhar (Dar Sinal)</button>
          <button class="choice-action" data-action="skip"><span aria-hidden="true">→</span> Passar</button>
          <button class="choice-action" data-action="mute"><span aria-hidden="true">−</span> Ver menos (Cortar Ruído)</button>
        </div>
      </article>
      <aside class="algorithm-board">
        <p class="kicker">Osciloscópio de Recomendações</p>
        <div class="stage-meter">
          <div><label for="signal">Sinal Útil (Meta: ≥ 4) <b id="signal-value"></b></label><meter id="signal" min="0" max="6" value="0"></meter></div>
          <div><label for="noise">Ruído / Iscas (Meta: ≤ 1) <b id="noise-value"></b></label><meter id="noise" min="0" max="8" value="2"></meter></div>
        </div>
        <ol id="feed-history" aria-label="Histórico das suas interações no feed"></ol>
      </aside>
    </div>`;
  const art = { useful: ['search', 'library', 'broadcast', 'news', 'lock', 'library'], noisy: ['broadcast', 'clock', 'broadcast', 'search', 'news', 'clock'] };

  function updateMeters() {
    $('#signal').value = signal;
    $('#signal-value').textContent = signal + '/6';
    $('#noise').value = noise;
    $('#noise-value').textContent = noise + '/8';
    setBar(turn, total);
  }

  function showPost() {
    const index = useful ? usefulIndex++ : noisyIndex++;
    const [title, copy] = (useful ? usefulPosts : noisyPosts)[index];
    const theme = useful ? 'useful' : 'noisy';
    $('#feed-illustration').setAttribute('src', 'feed-art.svg#' + art[theme][index]);
    $('#feed-turn').textContent = 'AMOSTRA DO FEED ' + (turn + 1) + ' DE ' + total;
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
          feedback('Sinal útil +1! O algoritmo passa a recomendar mais fontes verificáveis.', 'success');
        } else {
          noise++;
          feedback('Cuidado: você engajou com caça-cliques! Ruído +1 no seu feed.', 'warning');
        }
      } else if (action === 'mute') {
        if (useful) {
          signal = Math.max(0, signal - 1);
          useful = false;
          feedback('Você silenciou uma fonte informativa. O feed voltou a testar conteúdo ruidoso.', 'warning');
        } else {
          noise = Math.max(0, noise - 2);
          useful = true;
          feedback('Boa leitura! Ruído -2 e o algoritmo mudou para recomendações verificadas.', 'success');
        }
      } else {
        useful = !useful;
        playSound('click');
        feedback('Você passou sem interagir. O algoritmo testará outra categoria a seguir.');
      }
      const step = document.createElement('li');
      step.textContent = 'Turno ' + (turn + 1) + ' · ' + button.dataset.action.toUpperCase() + ' → Sinal: ' + signal + ' | Ruído: ' + noise;
      $('#feed-history').append(step);
      turn++;
      updateMeters();
      if (turn < total) {
        showPost();
        focus('#feed-title');
      } else if (signal >= 4 && noise <= 1) {
        finishMission('Algoritmo calibrado com ' + signal + ' de sinal útil e apenas ' + noise + ' de ruído.');
      } else {
        actions.forEach((choice) => { choice.disabled = true; });
        $('#feed-turn').textContent = 'AUDITORIA DE FEED INCOMPLETA';
        $('#feed-title').textContent = 'O ruído ainda dominou as recomendações';
        $('#feed-text').textContent = 'Dica pericial: use “Ver menos” nas postagens alarmistas para derrubar o ruído e “Acompanhar” nas fontes com data e autoria.';
        feedback('Placar final: ' + signal + ' de sinal útil (meta ≥ 4) e ' + noise + ' de ruído (meta ≤ 1).', 'warning');
        showNext('Reiniciar calibração do feed ↻', () => startMission('influence'));
        focus('#feed-title');
      }
    };
  });
  updateMeters();
  showPost();
}

const defenses = [
  ['Senha exclusiva e forte', 'Impede que o vazamento de outro site dê acesso a esta conta.'],
  ['Autenticação em dois fatores (2FA)', 'Exige confirmação extra mesmo que alguém descubra sua senha.'],
  ['Acesso apenas pelo canal oficial', 'Neutraliza links falsos de phishing enviados por e-mail ou SMS.'],
  ['Perfil privado nas redes', 'Restringe quem vê suas fotos, mas não impede roubo de senha ou phishing.'],
  ['Navegação em modo anônimo', 'Não salva histórico local, mas não bloqueia invasores nem links falsos.'],
];
const attacks = [
  ['Ataque 01 · Vazamento de senha em outro cadastro', 'Bloqueado! A senha exclusiva evitou a reutilização de credenciais.', 'Vulnerável! Sem senha exclusiva, o invasor entrou usando senha vazada.'],
  ['Ataque 02 · Tentativa de login com senha capturada', 'Bloqueado! O segundo fator (2FA) barrou o acesso não autorizado.', 'Vulnerável! Sem segundo fator (2FA), apenas a senha bastou para invadir.'],
  ['Ataque 03 · Link falso de suporte (Phishing)', 'Bloqueado! O hábito de abrir apenas o canal oficial evitou a página clonada.', 'Vulnerável! Sem conferência pelo canal oficial, o link falso capturou a sessão.'],
];

function defend() {
  const equipped = new Set();
  stage.innerHTML = `
    <p class="round-goal">Selecione exatamente os <strong>três controles de segurança</strong> capazes de barrar: (1) vazamento de senha de outro serviço, (2) login indevido e (3) link falso de suporte.</p>
    <div class="defense-console"><img src="feed-art.svg#lock" alt=""><div><p class="kicker">Terminal de Defesa da Conta Aurora</p><p class="stage-tip" id="defense-slots">0/3 módulos de blindagem ativos</p><div id="defense-lights" aria-hidden="true"><i></i><i></i><i></i></div></div></div>
    <div class="shield-list">${defenses.map(([label, copy], index) =>
      '<button class="shield-item" data-defense="' + index + '" aria-pressed="false"><span>0' +
      (index + 1) + '</span><b>' + label + '</b><small>' + copy + '</small><i aria-hidden="true">+</i></button>').join('')}</div>
    <div class="stage-actions"><button class="primary" id="test-defenses" disabled>Executar Simulação de Ataques →</button></div>
    <div id="attack-log"></div>`;
  const test = $('#test-defenses');
  const log = $('#attack-log');
  all('[data-defense]').forEach((button, index) => {
    button.onclick = () => {
      if (!equipped.has(index) && equipped.size === 3) {
        feedback('Os 3 slots de defesa estão ocupados. Desative um módulo para testar outra combinação.', 'warning');
        return;
      }
      if (!equipped.delete(index)) equipped.add(index);
      const active = equipped.has(index);
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active);
      button.querySelector('i').textContent = active ? '✓' : '+';
      $('#defense-slots').textContent = equipped.size + '/3 módulos de blindagem ativos';
      $('#defense-lights').setAttribute('data-filled', equipped.size);
      test.disabled = equipped.size !== 3;
      log.replaceChildren();
      setBar(0, attacks.length);
      playSound('click');
      feedback(active ? 'Módulo equipado no terminal.' : 'Módulo removido.');
    };
  });
  test.onclick = () => {
    const blocked = attacks.filter((_, index) => equipped.has(index)).length;
    setBar(blocked, attacks.length);
    log.innerHTML = '<article class="mission-recap"><h3 id="attack-title" tabindex="-1">Relatório de Intrusão: ' +
      blocked + '/3 ameaças neutralizadas</h3><ul>' + attacks.map(([name, success, failure], index) =>
      '<li><b>' + name + '</b> — ' + (equipped.has(index) ? success : failure) + '</li>'
    ).join('') + '</ul></article>';
    if (blocked === attacks.length) {
      all('[data-defense]').forEach((button) => { button.disabled = true; });
      test.disabled = true;
      feedback('Blindagem aprovada! Os três ataques foram neutralizados.', 'success');
      showNext('Carimbar laudo de segurança →', () => finishMission('3 de 3 vetores de ataque bloqueados pela tríade de proteção.'));
    } else {
      feedback('A conta ainda ficou vulnerável a um dos ataques. Revise os 3 módulos essenciais e simule novamente!', 'warning');
    }
    focus('#attack-title');
  };
}

// Wire detective controls
$('#sound-toggle').onclick = () => {
  soundEnabled = !soundEnabled;
  const btn = $('#sound-toggle');
  btn.setAttribute('aria-pressed', String(soundEnabled));
  btn.textContent = soundEnabled ? '🔊 Som' : '🔇 Mudo';
  if (soundEnabled) playSound('clue');
};

$('#toggle-loupe').onclick = () => {
  const drawer = $('#loupe-drawer');
  const btn = $('#toggle-loupe');
  const isHidden = drawer.hidden;
  drawer.hidden = !isHidden;
  btn.setAttribute('aria-pressed', String(isHidden));
  playSound('clue');
};

avatars.forEach((button) => {
  button.onclick = () => {
    avatar = button;
    write('name', avatar.dataset.name);
    write('avatar', avatar.dataset.avatar);
    playSound('clue');
    updateHud();
  };
});
missionButtons.forEach((button) => {
  button.onclick = () => {
    if (activeMission === button.dataset.track) {
      showView('play');
      focus('#question');
    } else {
      startMission(button.dataset.track);
    }
  };
});
$('#back-to-map').onclick = returnToMap;
viewButtons.forEach((button) => {
  button.onclick = () => {
    playSound('click');
    showView(button.dataset.view);
    focus({ missao: '#map-title', habilidades: '#skills-title', sobre: '#journal-title', perfil: '#profile-title' }[button.dataset.view]);
  };
});
$('#avatar-mini').onclick = () => { showView('perfil'); focus('#profile-title'); };
$('#start').onclick = () => { showView('missao'); focus('#map-title'); };
$('#begin').onclick = () => {
  write('intro-seen', 'yes');
  $('#intro').close();
  playSound('stamp');
  showView('missao');
  focus('#map-title');
};
$('#intro').addEventListener('cancel', () => write('intro-seen', 'yes'));
$('#message').value = read('reflection') || '';
$('#feedback-form').onsubmit = (event) => {
  event.preventDefault();
  const message = $('#message').value.trim();
  if (message) playSound('stamp');
  $('#form-status').textContent = !message ? 'Escreva um protocolo ou reflexão antes de carimbar.' :
    write('reflection', message) ? '✓ Nota pericial carimbada e salva neste dispositivo.' : 'O navegador bloqueou o salvamento local.';
};
updateHud();
if (!read('intro-seen') && progress.done.size === 0) $('#intro').showModal();
