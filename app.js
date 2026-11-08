const missions = {
  news: {
    label: 'Boato no bairro',
    title: 'O detetive do feed',
    scene: 'DOSSIÊ ABERTO',
    badge: 'Olhar crítico',
    recap: 'A imagem era antiga, a autoria era desconhecida e a pressão para compartilhar escondia a falta de contexto.',
    play: investigate,
  },
  timeline: {
    label: 'Checagem de informação',
    title: 'O recorte fora de hora',
    scene: 'MESA DE CRONOLOGIA',
    badge: 'Rastreador de contexto',
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
    scene: 'FEED EM TEMPO REAL',
    badge: 'Leitura de feed',
    recap: 'Suas interações mudaram as próximas sugestões. Na vida real, cada plataforma combina vários sinais para recomendar conteúdo.',
    play: trainFeed,
  },
  advertising: {
    label: 'Marketing e persuasão',
    title: 'O anúncio de cinco minutos',
    scene: 'CAPTURA DE ANÚNCIO',
    badge: 'Leitura de campanha',
    recap: 'A contagem regressiva, a promessa de exclusividade e o patrocínio escondido indicam técnicas de persuasão. Avalie os termos e a identidade de quem anuncia antes de comprar.',
    play: editAd,
  },
  phishing: {
    label: 'Phishing e roubo de conta',
    title: 'O suporte que pediu o código',
    scene: 'CAIXA DE ENTRADA',
    badge: 'Perícia de e-mail',
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
    scene: 'CONTA SOB ATAQUE',
    badge: 'Modo proteção',
    recap: 'A senha exclusiva, o segundo fator e a verificação pelo canal oficial bloquearam ameaças diferentes.',
    play: defend,
  },
  inbox: {
    label: 'Fraudes por mensagem',
    title: 'Plantão de golpes',
    scene: 'CENTRAL DE INCIDENTES',
    badge: 'Verificação independente',
    recap: 'Você confirmou a identidade por um contato conhecido, verificou a situação da família, consultou o rastreio oficial e conferiu a atividade da conta sem usar os atalhos recebidos.',
    play: triage,
  },
  finale: {
    label: 'Reconstrução do caso',
    title: 'Operação Fio Vermelho',
    scene: 'QUADRO DE EVIDÊNCIAS',
    badge: 'Investigação integrada',
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

const $ = (selector) => document.querySelector(selector);
const all = (selector) => [...document.querySelectorAll(selector)];
const stage = $('#game-stage');
const result = $('#result');
const next = $('#next');
const missionIds = Object.keys(missions);
const avatars = all('.avatar-option');
$('#case-files').innerHTML = missionIds.map((id, index) => {
  const { title, label } = missions[id];
  return '<button class="mission" data-track="' + id + '"><span class="mission-num">' +
    String(index + 1).padStart(2, '0') + '</span><span><small>NÍVEL ' + (index + 1) + '</small><strong>' +
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
  element.focus({ preventScroll: true });
  element.scrollIntoView({ block: 'nearest' });
}

function updateHud() {
  const { xp, done } = progress;
  const level = Math.min(missionIds.length + 1, Math.floor(xp / reward) + 1);
  $('#xp').textContent = xp;
  $('#level').textContent = 'Nível ' + level;
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
      : activeMission === id ? 'Em investigação' : button.disabled ? 'Lacrado' : 'Disponível · 60 XP';
    const skill = $('#skill-' + id);
    if (skill) {
      skill.classList.toggle('unlocked', complete);
      skill.querySelector('small').textContent = complete ? 'Desbloqueado' : 'Bloqueado';
    }
  });
  const won = done.size === missionIds.length;
  $('.final-skill').classList.toggle('unlocked', won);
  $('.final-skill small').textContent = won ? 'Arquivo completo' : 'Complete os oito casos';
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
}

function showNext(label, action) {
  next.textContent = label;
  next.onclick = action;
  next.hidden = false;
}

function returnToMap() {
  activeMission = null;
  showView('missao');
  updateHud();
  focus('#map-title');
}

function startMission(id) {
  if (!available(id)) return;
  const mission = missions[id];
  activeMission = id;
  showView('play');
  $('#map-radio').textContent = briefings[id];
  $('#mission-name').textContent = 'CASO ' + String(missionIds.indexOf(id) + 1).padStart(2, '0');
  $('#case-stage').textContent = '1/3 · Briefing';
  $('#scenario').textContent = mission.label.toUpperCase();
  $('#question').textContent = mission.title;
  next.hidden = true;
  feedback();
  setBar(0, 1);
  stage.innerHTML = '<article class="mission-recap briefing"><p class="kicker">Mensagem da Inspetora Lia</p><p>' +
    briefings[id] + '</p></article>';
  showNext('Abrir evidências →', () => {
    next.hidden = true;
    $('#case-stage').textContent = '2/3 · Investigação';
    $('#scenario').textContent = mission.scene;
    mission.play();
    focus('#question');
  });
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
  $('#map-radio').textContent = nextId ? 'Relatório recebido. A próxima pasta está aberta.' : 'Arquivo completo. Todas as evidências foram registradas.';
  $('#scenario').textContent = nextId ? 'MISSÃO CUMPRIDA' : 'CAMPANHA CONCLUÍDA';
  $('#case-stage').textContent = '3/3 · Relatório';
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
  showNext(nextId ? 'Abrir próximo caso →' : 'Voltar ao arquivo →',
    nextId ? () => startMission(nextId) : returnToMap);
  updateHud();
  focus('#question');
}

const briefings = {
  news: 'Uma publicação viral diz que um aviso do bairro mudou. Examine o post, separe pistas úteis e consulte o boletim oficial.',
  timeline: 'A imagem do post também apareceu em um jornal antigo. Organize os registros para descobrir o que foi tirado de contexto.',
  influence: 'O perfil que espalhou o recorte apareceu em várias recomendações. Teste como o feed reage aos seus cliques.',
  advertising: 'Uma oferta começou a aparecer junto com o conteúdo viral. Procure sinais de publicidade pouco transparente e pressão pela compra.',
  phishing: 'Quem abriu a oferta recebeu um e-mail de suporte. Analise os detalhes e compare com as informações da conta.',
  privacy: 'O e-mail pode ter colocado a conta em risco. Monte uma defesa e verifique o que ela bloqueia.',
  inbox: 'Chegaram cinco alertas ao plantão. Abra cada conversa e confira a situação por um canal independente. Um dos registros contém uma ameaça fictícia de sequestro.',
  finale: 'Reúna os registros dos casos anteriores. O relatório precisa ligar a publicação viral ao falso suporte sem atribuir identidade a ninguém sem prova.',
};

function inspectDocument({ title, prompt, fields, reference, comparison, email = false }) {
  const marked = new Set();
  const expected = fields.filter(([, , clue]) => clue).length;
  const documentHeading = email
    ? '<div class="mail-toolbar"><span>✉ Caixa de entrada</span><span>EVIDÊNCIA 05–A</span></div>'
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
    $('#marked-count').textContent = marked.size + '/' + expected + ' trechos marcados';
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
      preview.textContent = copy;
      preview.hidden = true;
      heading.textContent = 'Reativar conta · Inspecionar destino';
      button.append(heading, preview);
      button.onclick = () => {
        if (preview.hidden) {
          preview.hidden = false;
          heading.textContent = 'Destino do botão · Marcar evidência';
          feedback('Prévia aberta em segurança. O endereço é exibido como texto.');
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
      feedback('');
      updateMarks();
    }
    list.append(button);
  });
  compare.onclick = () => {
    if ([...marked].some((index) => !fields[index][2])) {
      feedback('Uma marcação descreve um detalhe comum. Releia o objetivo e substitua a marcação por um trecho que sustente sua suspeita.', 'warning');
      return;
    }
    if (email) {
      $('#case-stage').textContent = '2/3 · Verificação';
      $('#map-radio').textContent = 'Três indícios registrados. Agora confira a situação da conta por um caminho que você já conhece.';
      stage.insertAdjacentHTML('beforeend',
        '<article class="game-card verification"><h3 id="verification-title" tabindex="-1">Como você vai confirmar o aviso?</h3>' +
        '<div class="stage-actions"><button class="choice-action" id="reply-mail">Responder ao remetente</button>' +
        '<button class="primary" id="official-channel">Consultar o app oficial →</button></div></article>');
      compare.disabled = true;
      list.querySelectorAll('button').forEach((button) => { button.disabled = true; });
      $('#reply-mail').onclick = () => feedback('Responder mantém o contato com um remetente suspeito. Confira a conta por um canal que você já usa.', 'warning');
      $('#official-channel').onclick = showComparison;
      feedback('Evidências anexadas. Escolha um canal para conferir o aviso.', 'success');
      focus('#verification-title');
      return;
    }
    showComparison();
  };
  function showComparison() {
    feedback('');
    stage.innerHTML = '<article class="evidence-paper"><p class="paper-stamp">Conferência concluída</p><h3 id="comparison-title" tabindex="-1">O que o registro confirma</h3><p></p></article>';
    $('.evidence-paper p:last-child').textContent = reference;
    if (comparison) {
      const example = document.createElement('p');
      example.textContent = comparison;
      $('.evidence-paper').append(example);
    }
    setBar(1, 1);
    showNext('Arquivar perícia →', () => finishMission());
    focus('#comparison-title');
  }
  updateMarks();
}

function editAd() {
  const changes = new Set();
  const edits = [
    ['Identificar o patrocínio', 'Parceria paga · Loja Estação', 'Patrocínio escondido'],
    ['Retirar a falsa urgência', 'Oferta sem cronômetro · Consulte o prazo', '05:00 · Só agora!'],
    ['Mostrar condições e vendedor', 'Loja Estação · Consulte preço, frete e condições', 'Oferta exclusiva · Compre já'],
  ];
  stage.innerHTML = `
    <p class="round-goal">Você recebeu a peça para revisão. Edite o anúncio e acompanhe o resultado na prévia.</p>
    <div class="feed-lab">
      <article class="evidence-paper ad-workbench">
        <img class="ad-evidence-art" src="feed-art.svg#clock" alt="">
        <p class="paper-stamp" id="ad-0"></p>
        <h3 id="ad-1"></h3><p id="ad-2"></p>
      </article>
      <section class="algorithm-board"><p class="kicker">Ferramentas de edição</p>
        <div class="verdict-actions">${edits.map(([label], index) => '<button class="choice-action" data-edit-ad="' + index + '" aria-pressed="false">' + label + '</button>').join('')}</div>
        <button class="primary" id="publish-ad" disabled>Entregar peça revisada →</button>
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
      preview();
    };
  });
  publish.onclick = () => finishMission('A nova peça identifica a publicidade e mostra onde consultar as condições da oferta.');
  preview();
}

const incidents = [
  ['WhatsApp', 'Número desconhecido', 'Oi, mãe! Troquei de número.', 'Me faz um Pix agora? Meu banco ainda não funciona neste celular.', 'Ligar para o número já salvo', 'O familiar atende no número conhecido e confirma que não pediu dinheiro.', 'Foto, nome e uma história urgente não confirmam identidade. Confira por um contato que você já conhece.'],
  ['WhatsApp', 'Contato sem identificação', 'Estamos com seu irmão. Faça um Pix.', 'Não avise ninguém.', 'Acionar a polícia e pedir ajuda para confirmar em paralelo', 'A equipe do plantão faz a verificação. O familiar é localizado em segurança e a ameaça é registrada.', 'Em situação real de risco imediato, ligue 190 e siga as orientações da polícia.'],
  ['SMS', 'Aviso de entrega', 'Entrega retida por taxa.', 'Acesse entregas-pendentes.example/liberar para liberar seu pacote.', 'Consultar o rastreio pelo app da loja', 'O rastreio oficial não mostra taxa pendente. O endereço do SMS não pertence ao serviço.', 'Abra o canal da loja ou da transportadora que você já conhece. Confira ali o status do pedido.'],
  ['E-mail', 'De: eu@exemplo.example', 'Eu entrei na sua conta. Pague para evitar a divulgação dos seus dados.', 'O campo “De” mostra o mesmo endereço que o seu.', 'Abrir o provedor e conferir a atividade da conta', 'Nesta simulação, o provedor não encontrou acesso suspeito. O remetente exibido pode ser falsificado.', 'Se houver acesso desconhecido ou você tiver informado a senha em um site suspeito, troque-a pelo canal oficial, encerre sessões suspeitas e ative a autenticação em dois fatores.'],
  ['E-mail', 'Cobrança · Fatura atualizada', 'O boleto anterior foi cancelado. Pague a segunda via anexada.', 'Anexo simulado: segunda-via.pdf', 'Conferir a fatura na área oficial do cliente', 'A empresa confirma que a fatura disponível no aplicativo tem outro beneficiário. O anexo é uma cobrança falsa.', 'Confira o beneficiário e o valor no aplicativo do banco e compare com a fatura obtida no canal oficial antes de pagar.'],
];

function triage() {
  let incident = 0;
  function openIncident() {
    const [channel, sender, first, second, safe, outcome, lesson] = incidents[incident];
    const choices = [
      '<button class="choice-action" id="incident-reply">' + ['Responder e pedir a chave Pix', 'Fazer o Pix para ganhar tempo', 'Abrir o link para conferir a taxa', 'Responder ao e-mail para negociar', 'Abrir o anexo para pagar a segunda via'][incident] + '</button>',
      '<button class="choice-action" id="incident-check">' + safe + '</button>',
    ];
    if (incident % 2) choices.reverse();
    next.hidden = true;
    feedback('');
    setBar(incident, incidents.length);
    stage.innerHTML = `
      <div class="feed-lab">
        <article class="chat-evidence incident-screen">
          <div class="chat-head"><strong>${sender}</strong><small>${channel} simulado · Alerta ${incident + 1}/${incidents.length}</small></div>
          <div class="chat-thread"><p>${first}</p><p>${second}</p>${channel === 'SMS' ? '<button class="choice-action" id="incident-preview">⌕ Inspecionar endereço</button><p id="incident-destination" hidden>Destino exibido: entregas-pendentes.example. O jogo não abre esse endereço.</p>' : ''}</div>
        </article>
        <section class="algorithm-board">
          <p class="kicker">Mesa do plantão</p>
          <h3 id="incident-title" tabindex="-1">Como você vai verificar o alerta?</h3>
          <div class="verdict-actions">${choices.join('')}</div>
          <div class="incident-report" id="incident-report" hidden></div>
        </section>
      </div>`;
    if (channel === 'SMS') {
      $('#incident-preview').onclick = () => {
        $('#incident-destination').hidden = false;
        $('#incident-preview').disabled = true;
        focus('#incident-check');
      };
    }
    $('#incident-reply').onclick = () => feedback('A mensagem ainda não foi verificada. Use um canal independente antes de agir.', 'warning');
    $('#incident-check').onclick = () => {
      $('#incident-reply').disabled = true;
      $('#incident-check').disabled = true;
      const report = $('#incident-report');
      report.textContent = outcome + ' ' + lesson;
      report.hidden = false;
      feedback('Verificação concluída.', 'success');
      setBar(incident + 1, incidents.length);
      showNext(incident + 1 === incidents.length ? 'Arquivar plantão →' : 'Abrir próximo alerta →', () => {
        incident++;
        if (incident === incidents.length) finishMission(incidents.length + ' alertas verificados por canais independentes.');
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
    ['Página da oferta', 'O formulário em painel-de-acesso.example pediu o e-mail de Júlia.'],
    ['Registro oficial', 'A Conta Aurora não registrou bloqueio nem solicitou código.'],
    ['Falso suporte', 'O botão do e-mail leva a painel-de-acesso.example.'],
    ['Aviso de bloqueio', 'O e-mail diz que a conta será bloqueada e pede um código.'],
  ];
  const pairs = new Set(['0:2', '1:3']);
  const linked = new Set();
  let selected = null;
  stage.innerHTML = witnessChat() + `
    <p class="round-goal">Ligue os dois documentos que mostram o mesmo endereço. Depois, ligue o aviso de bloqueio ao registro que o desmente.</p>
    <div class="record-grid">${fragments.map(([title, detail], index) =>
      '<button class="evidence-paper record" data-link="' + index + '" aria-pressed="false"><strong>' + title + '</strong>' + detail + '</button>').join('')}</div>
    <ol id="connections" class="connection-list"></ol>
    <button class="primary" id="file-connections" disabled>Arquivar vínculos →</button>`;
  wireWitness();
  const cards = all('[data-link]');
  cards.forEach((card, index) => {
    card.onclick = () => {
      if (selected === null) {
        selected = index;
        card.setAttribute('aria-pressed', 'true');
        feedback('Primeiro documento selecionado. Escolha o documento que se relaciona a ele.');
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
        feedback('Esses documentos não comprovam o vínculo procurado. Compare o endereço e a alegação de bloqueio.', 'warning');
        return;
      }
      linked.add(key);
      cards[first].disabled = true;
      card.disabled = true;
      const line = document.createElement('li');
      line.textContent = fragments[first][0] + ' ↔ ' + fragments[index][0];
      $('#connections').append(line);
      const archive = $('#file-connections');
      archive.disabled = linked.size !== pairs.size;
      (cards.find((item) => !item.disabled) || archive).focus();
      setBar(linked.size, pairs.size);
      feedback('Vínculo registrado.', 'success');
    };
  });
  $('#file-connections').onclick = () => finishMission('Endereço cruzado e bloqueio desmentido pelo registro oficial.');
}

function witnessChat() {
  return `
    <details class="chat-evidence">
      <summary>▣ Abrir conversa recuperada · Evidência 07–A</summary>
      <div class="chat-head"><strong>Grupo do bairro</strong><small>WhatsApp simulado · registro exportado</small></div>
      <div class="chat-thread">
        <p><b>Rafa</b>Alguém viu esse aviso? A postagem manda abrir uma oferta exclusiva.<small>08:11</small></p>
        <p class="chat-out"><b>Júlia</b>Eu abri. A página pediu meu e-mail para mandar a confirmação.<small>08:14</small></p>
        <p><b>Rafa</b>E o que veio na confirmação?<small>08:15</small></p>
        <p class="chat-out"><b>Júlia · Mensagem de voz</b><button id="play-witness" class="choice-action">▶ Ouvir relato</button><small id="witness-status" role="status"></small>
          <span id="witness-text">Depois de cadastrar meu e-mail, recebi uma mensagem que dizia ser do suporte. O botão apontava para o mesmo endereço da oferta e o texto pedia o código de acesso.</span><small>08:17 · Transcrição</small></p>
      </div>
    </details>`;
}

function wireWitness() {
    const playWitness = $('#play-witness');
    let reading = false;
    playWitness.onclick = () => {
      const status = $('#witness-status');
      if (!window.speechSynthesis || typeof SpeechSynthesisUtterance !== 'function') {
        status.textContent = 'Leitura em voz indisponível. A transcrição está abaixo.';
        return;
      }
      const speech = window.speechSynthesis;
      if (reading) {
        speech.cancel();
        reading = false;
        playWitness.textContent = '▶ Ouvir relato';
        status.textContent = 'Relato interrompido.';
        return;
      }
      const voice = new SpeechSynthesisUtterance($('#witness-text').textContent);
      voice.lang = 'pt-BR';
      const portuguese = speech.getVoices().find((option) => option.lang.toLowerCase() === 'pt-br');
      if (portuguese) voice.voice = portuguese;
      function completePlayback(message) {
        if (!reading) return;
        reading = false;
        playWitness.textContent = '▶ Ouvir relato';
        status.textContent = message;
      }
      voice.onend = () => completePlayback('Fim do relato.');
      voice.onerror = () => completePlayback('Não foi possível reproduzir. Leia a transcrição abaixo.');
      reading = true;
      playWitness.textContent = '■ Parar relato';
      status.textContent = 'Reproduzindo relato…';
      speech.speak(voice);
    };
  }

function arrange(prompt, records) {
  const order = [];
  const shuffled = [2, 0, 1, 3].filter((index) => index < records.length);
  stage.innerHTML = '<p class="round-goal">' + prompt + '</p><div class="record-grid"></div>' +
    '<article class="chronology-board"><h3>Sequência do dossiê</h3><ol id="record-order"></ol></article>' +
    '<div class="stage-actions"><button class="choice-action" id="undo-record" disabled>Retirar último</button>' +
    '<button class="primary" id="verify-order" disabled>Validar sequência →</button></div>';
  const buttons = new Map();
  const undo = $('#undo-record');
  const verify = $('#verify-order');
  function updateOrder() {
    $('#record-order').replaceChildren(...records.map((_, position) => {
      const entry = document.createElement('li');
      const index = order[position];
      entry.textContent = index === undefined ? 'Registro ' + (position + 1) : records[index][0];
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
      feedback('Registro anexado: ' + label + '.');
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
      feedback('Confira a posição ' + (mismatch + 1) + '. Use a data ou a ligação entre os registros para revisar a ordem.', 'warning');
      return;
    }
    finishMission();
  };
  updateOrder();
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
  let selected = null;
  let compared = false;
  stage.innerHTML = `
    <div class="forensics">
      <article class="evidence-phone" aria-label="Publicação apreendida">
        <div class="phone-top">09:14 <span>● ● ▰</span></div>
        <button class="hotspot phone-profile" data-evidence="0" aria-pressed="false"><span class="network-avatar" aria-hidden="true">R</span><span><b>Radar Agora</b><small>@radaragora · 12 min</small></span></button>
        <button class="hotspot phone-photo" data-evidence="1" aria-pressed="false" aria-label="Examinar a imagem da publicação">
          <img src="aviso.svg" alt="Cartaz com o título Aviso à comunidade, recortado na parte inferior">
          <span class="photo-loupe" aria-hidden="true">⌕</span>
        </button>
        <button class="hotspot phone-caption" data-evidence="2" aria-pressed="false"><strong>URGENTE: o aviso mudou!</strong>Compartilhe antes que apaguem.</button>
        <button class="hotspot phone-reactions" data-evidence="3" aria-pressed="false">♡ 2,4 mil <span>↗ 890</span></button>
      </article>
      <div class="forensics-board">
        <p class="kicker">Mesa de perícia · Evidência 01</p>
        <h3 id="evidence-title">Examine a publicação</h3>
        <p id="evidence-detail" aria-live="polite">Toque nas partes do post. Separe três pistas que sustentem a suspeita.</p>
        <div id="photo-archive" class="photo-archive" hidden>
          <button class="choice-action" id="compare-photo">Revelar o recorte original →</button>
          <figure id="original-photo" hidden><img src="aviso.svg" alt=""><figcaption>Rodapé original · Campanha de outro município, agosto de 2024.</figcaption></figure>
        </div>
        <button class="choice-action" id="pin" hidden>Fixar pista</button>
        <div class="dossier">
          <p class="kicker">Pistas fixadas</p>
          <ol id="dossier-slots" aria-label="Pistas no dossiê"></ol>
          <p class="stage-tip" id="dossier-count"></p>
          <button class="primary" id="verify">Consultar boletim oficial →</button>
        </div>
      </div>
    </div>`;
  const buttons = all('[data-evidence]');
  const pin = $('#pin');
  const verify = $('#verify');

  function updateEvidence() {
    if (selected !== null) {
      $('#evidence-title').textContent = evidence[selected].label;
      $('#evidence-detail').textContent = selected === 1 && !compared
        ? 'O post corta o rodapé do cartaz. Consulte o arquivo para recuperar o contexto.'
        : evidence[selected].detail;
    }
    $('#photo-archive').hidden = selected !== 1;
    $('#original-photo').hidden = !compared;
    $('#compare-photo').hidden = compared;
    pin.hidden = selected === null || (selected === 1 && !compared);
    pin.textContent = pinned.has(selected) ? 'Retirar do dossiê' : 'Fixar no dossiê';
    const slots = [...pinned].map((index) => evidence[index].label);
    $('#dossier-slots').replaceChildren(...Array.from({ length: 3 }, (_, index) => {
      const slot = document.createElement('li');
      slot.textContent = slots[index] || '—';
      slot.className = slots[index] ? 'pinned' : '';
      return slot;
    }));
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
  $('#compare-photo').onclick = () => {
    compared = true;
    updateEvidence();
    pin.focus();
  };
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
      <div class="verdict-board">
        <article class="evidence-paper official-bulletin">
          <p class="paper-stamp">Registro 01–B · Simulação</p>
          <h3 id="bulletin-title" tabindex="-1">Boletim da comunidade</h3>
          <p class="bulletin-date">CANAL OFICIAL · ATUALIZADO ÀS 10H</p>
          <p>O aviso publicado no mural do bairro continua em vigor. Nenhuma alteração foi anunciada hoje.</p>
          <p>O cartaz em circulação pertence a uma campanha de Vila do Farol, em agosto de 2024.</p>
        </article>
        <section class="forensics-board" aria-labelledby="verdict-title">
          <p class="kicker">Registro do investigador</p>
          <h3 id="verdict-title">Qual conclusão as provas sustentam?</h3>
          <ul class="verdict-clues"><li>Autoria do post sem confirmação</li><li>Cartaz antigo de outro município</li><li>Legenda pressiona o compartilhamento</li></ul>
          <div class="verdict-actions">
            <button class="choice-action" data-verdict="confirm">A mudança foi confirmada</button>
            <button class="choice-action" data-verdict="unknown">Ainda falta um registro confiável</button>
            <button class="choice-action" data-verdict="misleading">O post usa o cartaz fora de contexto</button>
          </div>
        </section>
      </div>`;
    $('#case-stage').textContent = '2/3 · Veredito';
    setBar(7, 8);
    feedback('Boletim localizado. Cruze o registro oficial com as pistas do dossiê.');
    all('[data-verdict]').forEach((button) => {
      button.onclick = () => {
        if (button.dataset.verdict === 'confirm') {
          feedback('Confira a primeira nota do boletim. Ela confirma que o aviso anterior continua em vigor.', 'warning');
          return;
        }
        if (button.dataset.verdict === 'unknown') {
          feedback('O boletim atualizado esclarece o que ocorreu no bairro e identifica a origem do cartaz.', 'warning');
          return;
        }
        finishMission('Veredito registrado: a publicação enganava ao reutilizar um cartaz antigo.');
      };
    });
    focus('#bulletin-title');
  };
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
    <div class="feed-lab">
      <article class="feed-card social-post">
        <div class="social-top"><span class="network-avatar" aria-hidden="true">↗</span><p class="kicker" id="feed-turn"></p></div>
        <div class="feed-cover" id="feed-cover" aria-hidden="true"><img id="feed-illustration" src="feed-art.svg#library" alt=""></div>
        <div class="social-copy"><h3 id="feed-title" tabindex="-1"></h3><p id="feed-text"></p></div>
        <div class="stage-actions">
          <button class="choice-action" data-action="follow"><span aria-hidden="true">＋</span> Acompanhar</button>
          <button class="choice-action" data-action="skip"><span aria-hidden="true">→</span> Passar</button>
          <button class="choice-action" data-action="mute"><span aria-hidden="true">−</span> Ver menos</button>
        </div>
      </article>
      <aside class="algorithm-board">
        <p class="kicker">Monitor de recomendações</p>
        <div class="stage-meter">
          <div><label for="signal">Sinal útil <b id="signal-value"></b></label><meter id="signal" min="0" max="6" value="0"></meter></div>
          <div><label for="noise">Ruído <b id="noise-value"></b></label><meter id="noise" min="0" max="8" value="2"></meter></div>
        </div>
        <ol id="feed-history" aria-label="Histórico das suas interações"></ol>
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
      const step = document.createElement('li');
      step.textContent = (turn + 1) + ' · ' + button.textContent.trim() + ' · ' + signal + ' sinal / ' + noise + ' ruído';
      $('#feed-history').append(step);
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
    <div class="defense-console"><img src="feed-art.svg#lock" alt=""><div><p class="kicker">Equipamento da conta</p><p class="stage-tip" id="defense-slots">0/3 defesas equipadas</p><div id="defense-lights" aria-hidden="true"><i></i><i></i><i></i></div></div></div>
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
      $('#defense-lights').setAttribute('data-filled', equipped.size);
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
    showView(button.dataset.view);
    focus({ missao: '#map-title', habilidades: '#skills-title', sobre: '#journal-title' }[button.dataset.view]);
  };
});
$('#avatar-mini').onclick = () => { showView('perfil'); focus('#profile-title'); };
$('#start').onclick = () => { showView('missao'); focus('#map-title'); };
$('#begin').onclick = () => {
  write('intro-seen', 'yes');
  $('#intro').close();
  showView('missao');
  focus('#map-title');
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
