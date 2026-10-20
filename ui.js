/* Danielle Slawacki — comportamento dos componentes + diagnóstico */
(function () {
  'use strict';
  var WA = '5514996296069';
  var EMAIL = 'danislawacki@gmail.com';
  document.documentElement.classList.remove('no-js');
  window.dataLayer = window.dataLayer || [];

  function track(name, params) {
    try { window.dataLayer.push(Object.assign({ event: name }, params || {})); } catch (e) {}
  }

  /* ---------- Origem do visitante (UTM / referrer) — pronto para campanhas ---------- */
  var origem = '';
  try {
    var q = new URLSearchParams(location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
    var saved = JSON.parse(sessionStorage.getItem('ds_origem') || '{}');
    keys.forEach(function (k) { if (q.get(k)) saved[k] = q.get(k); });
    if (!saved.ref && document.referrer && document.referrer.indexOf(location.host) === -1) {
      saved.ref = new URL(document.referrer).hostname;
    }
    sessionStorage.setItem('ds_origem', JSON.stringify(saved));
    var parts = [];
    if (saved.utm_source) parts.push(saved.utm_source + (saved.utm_medium ? '/' + saved.utm_medium : ''));
    else if (saved.gclid) parts.push('google');
    else if (saved.fbclid) parts.push('meta');
    else if (saved.ref) parts.push(saved.ref);
    if (saved.utm_campaign) parts.push('campanha ' + saved.utm_campaign);
    origem = parts.join(' · ');
  } catch (e) {}

  function waLink(msg) {
    var text = msg + (origem ? '\n\n(Origem: ' + origem + ')' : '');
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text);
  }
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = waLink(a.getAttribute('data-wa'));
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Eventos de conversão (dataLayer) ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-wa],[data-track],a[href^="mailto:"],a[href*="instagram.com"]');
    if (!el) return;
    var type = el.hasAttribute('data-wa') ? 'whatsapp' : el.getAttribute('href') && el.getAttribute('href').indexOf('mailto:') === 0 ? 'email' :
      el.getAttribute('href') && el.getAttribute('href').indexOf('instagram') > -1 ? 'instagram' : (el.getAttribute('data-track') || 'cta');
    track('contato_clique', { canal: type, pagina: location.pathname });
  });

  /* ---------- Toast ---------- */
  var toaster = document.querySelector('.toaster');
  function toast(msg) {
    if (!toaster) return;
    var t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg; t.setAttribute('role', 'status');
    toaster.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-copy');
      if (navigator.clipboard) navigator.clipboard.writeText(v).then(function () { toast('Copiado: ' + v); }, function () { toast(v); });
      else toast(v);
    });
  });

  /* ---------- Header, progresso de leitura, voltar ao topo ---------- */
  var header = document.querySelector('.site-header');
  var bar = document.querySelector('.scroll-progress');
  var toTop = document.querySelector('.to-top');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (toTop) toTop.classList.toggle('show', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Sheet (menu mobile) ---------- */
  var sheet = document.getElementById('sheet');
  var overlay = document.querySelector('.sheet-overlay');
  function setSheet(open) {
    if (!sheet) return;
    sheet.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
    sheet.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  document.querySelectorAll('[data-sheet-open]').forEach(function (b) { b.addEventListener('click', function () { setSheet(true); }); });
  document.querySelectorAll('[data-sheet-close]').forEach(function (b) { b.addEventListener('click', function () { setSheet(false); }); });
  if (overlay) overlay.addEventListener('click', function () { setSheet(false); });
  if (sheet) sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setSheet(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setSheet(false); });

  /* ---------- Dialog ---------- */
  document.querySelectorAll('[data-dialog-open]').forEach(function (b) {
    b.addEventListener('click', function () {
      var d = document.getElementById(b.getAttribute('data-dialog-open'));
      if (d && d.showModal) d.showModal();
    });
  });
  document.querySelectorAll('dialog.dialog').forEach(function (d) {
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    d.querySelectorAll('[data-dialog-close]').forEach(function (b) { b.addEventListener('click', function () { d.close(); }); });
  });

  /* ---------- Tabs ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var triggers = root.querySelectorAll('.tabs-trigger');
    var panels = root.querySelectorAll('.tabs-content');
    function select(i, focus) {
      triggers.forEach(function (t, j) {
        t.setAttribute('aria-selected', j === i ? 'true' : 'false');
        t.tabIndex = j === i ? 0 : -1;
      });
      panels.forEach(function (p, j) { p.classList.toggle('active', j === i); });
      if (focus) triggers[i].focus();
    }
    triggers.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % triggers.length, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + triggers.length) % triggers.length, true); }
      });
    });
    select(0);
  });

  /* ---------- Reveal ---------- */
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: .1 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- Diagnóstico ---------- */
  var card = document.getElementById('quizCard');
  if (!card) return;

  var partNames = ['Sobre o conflito', 'Diálogo entre as partes', 'Filhos e dependentes', 'Tempo de conflito', 'Sua prioridade',
    'Situação judicial', 'Acompanhamento jurídico', 'Urgência', 'Conversas conjuntas', 'O que você espera'];
  var steps = card.querySelectorAll('.quiz-step');
  var total = steps.length;
  var current = 0;
  var answers = {};
  var fill = document.getElementById('quizFill');
  var meter = document.getElementById('quizMeter');
  var partLabel = document.getElementById('quizPartLabel');
  var partName = document.getElementById('quizPartName');
  var backBtn = document.getElementById('quizBack');
  var progressWrap = document.getElementById('quizProgressWrap');
  var result = document.getElementById('quizResult');
  var nav = document.getElementById('quizNav');

  function renderProgress() {
    var pct = (current / total) * 100;
    fill.style.width = pct + '%';
    meter.setAttribute('aria-valuenow', Math.round(pct));
    partLabel.textContent = 'Parte ' + (current + 1) + ' de ' + total;
    partName.textContent = partNames[current];
    backBtn.classList.toggle('show', current > 0);
  }
  function goTo(i) {
    steps.forEach(function (s) { s.classList.remove('active'); });
    steps[i].classList.add('active');
    current = i;
    renderProgress();
  }
  renderProgress();

  card.querySelectorAll('.quiz-options').forEach(function (group) {
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('.quiz-option');
      if (!btn) return;
      var qi = group.getAttribute('data-q');
      answers[qi] = btn.getAttribute('data-value');
      group.querySelectorAll('.quiz-option').forEach(function (b) { b.classList.remove('selected'); b.setAttribute('aria-checked', 'false'); });
      btn.classList.add('selected');
      btn.setAttribute('aria-checked', 'true');
      if (qi === '0') track('diagnostico_inicio', { tipo: answers[0] });
      setTimeout(function () { if (current < total - 1) goTo(current + 1); else showResult(); }, 260);
    });
  });
  backBtn.addEventListener('click', function () { if (current > 0) goTo(current - 1); });

  var labelMap = {
    1: { dificil: 'diálogo difícil, mas existente', rompido: 'diálogo rompido', semcontato: 'prefere sem contato direto' },
    2: { 'filhos-menores': 'filhos menores envolvidos', 'filhos-adultos': 'filhos adultos/dependentes envolvidos', 'sem-filhos': 'sem filhos envolvidos' },
    3: { recente: 'conflito recente', meses: 'conflito com alguns meses', anos: 'conflito de anos' },
    4: { relacao: 'prioridade: preservar a relação', rapido: 'prioridade: agilidade', direitos: 'prioridade: entender direitos' },
    5: { sim: 'processo judicial em curso', nao: 'sem processo judicial', talvez: 'não tem certeza sobre processo judicial' },
    6: { 'tem-advogado': 'já tem advogado(a)', procurando: 'buscando advogado(a)', 'nao-sabe': 'não sabe se precisa de advogado' },
    7: { urgente: 'urgência alta', moderada: 'urgência moderada', semPressa: 'sem pressa' },
    8: { confortavel: 'confortável com conversas conjuntas', 'precisa-preparo': 'precisa de preparo antes', inseguro: 'insegura(o) com conversas diretas' },
    9: { acordo: 'busca acordo formalizado', dialogo: 'busca retomar o diálogo', clareza: 'busca clareza sobre direitos' }
  };

  function showResult() {
    steps.forEach(function (s) { s.style.display = 'none'; });
    progressWrap.style.display = 'none';
    nav.style.display = 'none';
    result.classList.add('active');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });

    var tipoLabels = { familiar: 'familiar', societario: 'societário', imobiliario: 'imobiliário', escolar: 'escolar' };
    var tipo = tipoLabels[answers[0]] || 'seu';
    var s = [];

    if (answers[1] === 'rompido') s.push('Mesmo com o diálogo direto rompido, a mediação cria um espaço seguro e conduzido para que a conversa volte a acontecer, com a presença de uma mediadora.');
    else if (answers[1] === 'semcontato') s.push('É comum preferir não ter contato direto no início — por isso o processo começa com sessões individuais de pré-mediação, sem que as partes precisem se falar diretamente ainda.');
    else s.push('Como ainda existe algum diálogo entre as partes, esse é um ótimo ponto de partida para um processo conduzido com cuidado.');

    if (answers[2] === 'filhos-menores') s.push('Como há filhos menores envolvidos, um dos focos do trabalho será justamente construir planos de parentalidade e convivência que protejam o bem-estar deles.');
    else if (answers[2] === 'filhos-adultos') s.push('Com filhos adultos ou outros familiares dependentes na história, a mediação intergeracional pode ajudar a organizar os interesses de todas as gerações envolvidas.');
    else s.push('Sem filhos ou dependentes diretamente envolvidos, o processo pode se concentrar de forma mais objetiva nas questões entre as partes.');

    if (answers[3] === 'anos') s.push('Um conflito que se arrasta há anos costuma carregar bastante desgaste — a mediação oferece um espaço estruturado para finalmente destravar o que não avançou sozinho.');
    else if (answers[3] === 'meses') s.push('Como vocês já tentaram resolver sozinhos por um tempo, a condução de uma mediadora pode trazer justamente a estrutura que faltava para destravar o diálogo.');
    else s.push('Por ser uma situação ainda recente, buscar a mediação agora pode evitar que o conflito se prolongue e se torne mais desgastante com o tempo.');

    if (answers[4] === 'relacao') s.push('Já que preservar a relação é sua prioridade, a mediação foi pensada exatamente para isso: construir soluções sem desgastar os vínculos que vão continuar existindo.');
    else if (answers[4] === 'rapido') s.push('A mediação tende a ser um caminho mais rápido e menos desgastante do que um processo judicial longo.');
    else s.push('Ao longo de todo o processo, você conta com o acompanhamento de advogados — o que garante que seus direitos sejam considerados antes de qualquer decisão.');

    if (answers[5] === 'sim') s.push('Mesmo com um processo judicial em andamento, a mediação pode caminhar em paralelo e ajudar a construir um acordo mais rápido e sustentável.');
    else if (answers[5] === 'talvez') s.push('Se você não tem certeza sobre a situação judicial do caso, isso é algo que podemos esclarecer juntas logo na reunião de apresentação.');
    else s.push('Como ainda não há processo judicial em curso, este é o melhor momento para conhecer a mediação antes de qualquer decisão.');

    if (answers[6] === 'tem-advogado') s.push('Como você já conta com acompanhamento jurídico, seu advogado ou advogada pode participar ativamente ao seu lado durante todo o processo de mediação.');
    else if (answers[6] === 'procurando') s.push('Se você ainda está buscando orientação jurídica, podemos conversar sobre isso na reunião de apresentação — inclusive sobre como funciona a advocacia colaborativa.');
    else s.push('Não se preocupe se ainda não sabe se precisa de um advogado agora — isso é algo que fica mais claro depois de entender melhor o processo.');

    if (answers[7] === 'urgente') s.push('Pela urgência que você descreveu, podemos priorizar o agendamento da reunião de apresentação já nos próximos dias.');
    else if (answers[7] === 'semPressa') s.push('Como não há pressa, você pode usar esse tempo para entender bem o processo antes de decidir como seguir — sem nenhum compromisso.');
    else s.push('Com um prazo de alguns meses pela frente, há espaço tranquilo para conduzir cada etapa com o cuidado que ela pede.');

    if (answers[8] === 'inseguro') s.push('É natural ainda se sentir insegura(o) quanto a conversas diretas — por isso o processo é gradual, começando sempre por sessões individuais antes de qualquer encontro conjunto.');
    else if (answers[8] === 'precisa-preparo') s.push('As sessões individuais de pré-mediação existem justamente para te preparar com calma antes do diálogo conjunto.');
    else s.push('Sua disposição para participar de conversas conduzidas é um ótimo sinal de que o processo pode avançar de forma fluida.');

    if (answers[9] === 'acordo') s.push('Com foco em chegar a um acordo formalizado que todas as partes possam cumprir, a mediação é um caminho direto para isso.');
    else if (answers[9] === 'dialogo') s.push('Como o que você mais busca é retomar o diálogo e reorganizar a relação, esse é exatamente o coração do trabalho de mediação.');
    else s.push('Buscar clareza sobre seus direitos e opções antes de decidir é um passo maduro — a reunião de apresentação é o espaço ideal para isso, sem qualquer compromisso.');

    document.getElementById('resultTitle').textContent = 'Seu caso ' + tipo + ' tem bom potencial para mediação.';
    document.getElementById('resultBody').textContent = s.join(' ') + ' O próximo passo é uma Reunião de Apresentação.';

    var labels = Object.keys(labelMap).map(function (k) { return labelMap[k][answers[k]]; }).filter(Boolean);
    var chips = document.getElementById('resultChips');
    chips.innerHTML = '';
    var first = document.createElement('span');
    first.className = 'badge badge-gold'; first.textContent = 'Conflito ' + tipo;
    chips.appendChild(first);
    labels.slice(0, 5).forEach(function (l) {
      var c = document.createElement('span'); c.className = 'badge badge-outline'; c.textContent = l; chips.appendChild(c);
    });

    var msg = 'Olá, Danielle! Fiz o diagnóstico inicial no site e gostaria de agendar uma reunião de apresentação.\n\n' +
      'Tipo de conflito: ' + tipo + '\n' + 'Resumo das respostas: ' + labels.join(', ') + '.';
    var w = document.getElementById('resultWhats');
    w.href = waLink(msg); w.target = '_blank'; w.rel = 'noopener';
    document.getElementById('resultEmail').href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Reunião de apresentação - Diagnóstico do site') +
      '&body=' + encodeURIComponent(msg);
    track('diagnostico_concluido', { tipo: answers[0] });
  }

  document.getElementById('quizRestart').addEventListener('click', function () {
    Object.keys(answers).forEach(function (k) { delete answers[k]; });
    card.querySelectorAll('.quiz-option.selected').forEach(function (b) { b.classList.remove('selected'); b.setAttribute('aria-checked', 'false'); });
    result.classList.remove('active');
    progressWrap.style.display = ''; nav.style.display = '';
    steps.forEach(function (s) { s.style.display = ''; });
    goTo(0);
  });

  /* Pré-seleção do tipo de conflito (botões das áreas e ?tipo= vindo das landing pages) */
  function preselect(tipo) {
    var shell = document.getElementById('quizCard');
    shell.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function () {
      var opt = card.querySelector('.quiz-options[data-q="0"] .quiz-option[data-value="' + tipo + '"]');
      if (opt) opt.click();
    }, 550);
  }
  document.querySelectorAll('[data-quiz-tipo]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); preselect(b.getAttribute('data-quiz-tipo')); });
  });
  try {
    var t = new URLSearchParams(location.search).get('tipo');
    if (t && /^(familiar|societario|imobiliario|escolar)$/.test(t)) setTimeout(function () { preselect(t); }, 400);
  } catch (e) {}
})();
