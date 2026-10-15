/* =====================================================================
   Salão Alvany — comportamento comum a todas as páginas
   Carrega DEPOIS de config.js e agenda.js (usa window.TV.API).
   ===================================================================== */
(function () {
  'use strict';
  var CFG = window.TV;
  var DIAS = ['domingo','segunda','terça','quarta','quinta','sexta','sábado'];
  var SEMANA_CURT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

  function $(s) { return document.querySelector(s); }
  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }
  function min(t) { var p = String(t).split(':'); return (+p[0]) * 60 + (+p[1]); }
  function horaCurta(t) { var p = String(t).split(':'); return (+p[0]) + 'h' + (p[1] === '00' ? '' : p[1]); }
  function duracao(m) { return m < 60 ? m + ' min' : Math.floor(m / 60) + 'h' + (m % 60 ? String(m % 60).padStart(2, '0') : ''); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function deIso(s) { var p = String(s).split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function diaCurto(s) {
    var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    var d = deIso(s), dif = Math.round((d - hoje) / 86400000);
    if (dif === 0) return 'Hoje';
    if (dif === 1) return 'Amanhã';
    return SEMANA_CURT[d.getDay()] + ', ' + d.getDate() + '/' + String(d.getMonth() + 1).padStart(2, '0');
  }
  function valor(s) {
    if (!s.preco_centavos) return '<small>valor</small>sob consulta';
    return (s.a_partir_de ? '<small>a partir de</small>' : '') + 'R$ ' + (s.preco_centavos / 100).toFixed(2).replace('.', ',');
  }
  CFG.util = { el: el, duracao: duracao, valor: valor, diaCurto: diaCurto };

  /* ---- rodapé, faixa de demonstração ---- */
  var ano = $('#ano'); if (ano) ano.textContent = new Date().getFullYear();
  if (CFG.modoDemo && $('#faixa-demo')) $('#faixa-demo').hidden = false;

  /* ---- menu do celular ---- */
  var gaveta = $('#gaveta');
  if (gaveta) {
    function abre(sim) {
      if (sim) gaveta.setAttribute('data-aberta', ''); else gaveta.removeAttribute('data-aberta');
      $('#btn-menu').setAttribute('aria-expanded', sim ? 'true' : 'false');
      document.body.style.overflow = sim ? 'hidden' : '';
    }
    $('#btn-menu').addEventListener('click', function () { abre(true); });
    gaveta.addEventListener('click', function (e) { if (e.target === gaveta || e.target.closest('.gaveta-fechar') || e.target.closest('a')) abre(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') abre(false); });
  }

  /* ---- aberto / fechado agora ---- */
  (function status() {
    var agora = new Date(), m = agora.getHours() * 60 + agora.getMinutes();
    var hoje = CFG.expediente[agora.getDay()], txt = '', aberto = false;
    if (hoje && hoje.aberto && m >= min(hoje.abre) && m < min(hoje.fecha)) {
      aberto = true; txt = 'Aberto agora · até ' + horaCurta(hoje.fecha);
    } else {
      for (var i = 0; i < 8; i++) {
        var d = (agora.getDay() + i) % 7, e = CFG.expediente[d];
        if (!e || !e.aberto || (i === 0 && m >= min(e.abre))) continue;
        txt = 'Fechado · abre ' + (i === 0 ? 'hoje' : i === 1 ? 'amanhã' : DIAS[d]) + ' às ' + horaCurta(e.abre);
        break;
      }
    }
    Array.prototype.forEach.call(document.querySelectorAll('[data-status]'), function (s) {
      s.textContent = txt;
      if (aberto) s.setAttribute('data-aberto', '');
    });
    var linha = document.querySelector('#tabela-horario tr[data-dia="' + agora.getDay() + '"]');
    if (linha) linha.setAttribute('data-hoje', '');
  })();

  /* ---- links de WhatsApp com mensagem ---- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-zap]'), function (a) {
    var txt = a.getAttribute('data-zap') || 'Oi, Alvani! Vim pelo site.';
    a.href = 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(txt);
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* ---- carrega profissionais e serviços uma vez ---- */
  var dados = Promise.all([CFG.API.barbeiros(), CFG.API.servicos()])
    .then(function (r) { return { barbeiros: r[0], servicos: r[1] }; });
  CFG.dados = dados;

  function linkAgendar(params) {
    var q = Object.keys(params).map(function (k) { return k + '=' + encodeURIComponent(params[k]); }).join('&');
    return 'agendar.html' + (q ? '?' + q : '');
  }
  CFG.linkAgendar = linkAgendar;

  /* ---- próximo horário livre (capa e outras páginas) ---- */
  function proximoLivre(b, s) {
    return CFG.API.dias(s, b).then(function (dias) {
      var d = dias.filter(function (x) { return x.vagas; })[0];
      if (!d) return null;
      return CFG.API.slots(d.dia, s, b).then(function (h) { return h.length ? { dia: d.dia, hora: h[0] } : null; });
    });
  }
  var caixaProx = $('#proximo');
  if (caixaProx) dados.then(function (d) {
    var servRef = d.servicos.filter(function (s) { return s.id === 'hidratacao' || s.slug === 'hidratacao'; })[0] || d.servicos[0];
    var b = d.barbeiros[0];
    var qd = $('#px-quando'), com = $('#px-com'), bt = $('#px-reservar');
    if (!b || !servRef) return;
    proximoLivre(b, servRef).then(function (p) {
      if (!p) { qd.textContent = 'Agenda cheia'; com.textContent = 'Chame no WhatsApp que a gente tenta encaixar.'; return; }
      qd.textContent = diaCurto(p.dia) + ' · ' + p.hora;
      com.innerHTML = '';
      com.appendChild(el('b', null, servRef.nome));
      com.appendChild(document.createTextNode(' · ' + duracao(servRef.duracao_min) + ' com ' + b.nome.split(' ')[0]));
      bt.href = linkAgendar({ servico: servRef.id, dia: p.dia, hora: p.hora });
      bt.removeAttribute('aria-disabled');
    });
  });

  /* ---- atalhos de serviço (capa) ---- */
  var atalhos = $('#atalhos');
  if (atalhos) dados.then(function (d) {
    atalhos.innerHTML = '';
    d.servicos.slice(0, 6).forEach(function (s) {
      var a = el('a', 'atalho'); a.href = linkAgendar({ servico: s.id });
      a.appendChild(el('span', 'pingo', '✦'));
      a.appendChild(el('b', null, s.nome.split(' / ')[0]));
      a.appendChild(el('small', null, duracao(s.duracao_min)));
      atalhos.appendChild(a);
    });
  });

  /* ---- cardápio completo (página de serviços) ---- */
  var cardapio = $('#cardapio');
  if (cardapio) dados.then(function (d) {
    cardapio.innerHTML = '';
    var grupos = {};
    d.servicos.forEach(function (s) {
      if (s.categoria === 'Assinatura') { cardapio.appendChild(cardAssinatura(s)); return; }
      var g = s.categoria || 'Serviços'; (grupos[g] = grupos[g] || []).push(s);
    });
    Object.keys(grupos).forEach(function (g) {
      var bloco = el('div', 'cardapio-grupo');
      bloco.id = g.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]+/g, '-');
      bloco.appendChild(el('div', 'cardapio-titulo', g));
      var grade = el('div', 'grade-servicos');
      grupos[g].forEach(function (s) {
        var card = el('article', 'servico');
        card.innerHTML =
          '<div class="servico-txt"><h3></h3><p></p>' +
            '<span class="tempo"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>' +
            duracao(s.duracao_min) + '</span></div>' +
          '<div class="servico-dir"><span class="preco"></span>' +
            '<a class="marcar">Agendar →</a></div>';
        card.querySelector('h3').textContent = s.nome;
        card.querySelector('p').textContent = s.descricao || '';
        card.querySelector('.preco').innerHTML = valor(s);
        card.querySelector('.marcar').href = linkAgendar({ servico: s.id });
        grade.appendChild(card);
      });
      bloco.appendChild(grade);
      cardapio.appendChild(bloco);
    });
  });
  function cardAssinatura(s) {
    var c = el('article', 'assinatura');
    var esq = el('div');
    esq.appendChild(el('p', 'rotulo', '✦ O carro-chefe do salão'));
    esq.appendChild(el('h3', null, s.nome));
    esq.appendChild(el('p', null, s.descricao || ''));
    var meta = el('div', 'meta');
    meta.appendChild(el('span', null, duracao(s.duracao_min) + ' de atendimento'));
    esq.appendChild(meta);
    var dir = el('div', 'servico-dir');
    var p = el('div', 'preco'); p.innerHTML = valor(s);
    dir.appendChild(p);
    var b = el('a', 'btn btn-prata', 'Agendar'); b.href = linkAgendar({ servico: s.id }); b.style.marginTop = '.8rem';
    dir.appendChild(b);
    c.appendChild(esq); c.appendChild(dir);
    return c;
  }

  /* ---- página de agendamento: chega com serviço/dia/hora na URL ---- */
  if ($('#agendar-app')) {
    var preenche = function (d) {
      var q = new URLSearchParams(location.search);
      var s = q.get('servico'), dia = q.get('dia'), hora = q.get('hora');
      if (!s) return;
      if (dia && hora && d.barbeiros.length) CFG.agendarDireto(d.barbeiros[0].id, s, dia, hora);
      else CFG.agendarServico(s);
      setTimeout(function () {
        window.scrollTo({ top: $('#agendar-app').getBoundingClientRect().top + window.scrollY - 90 });
      }, 350);
    };
    // aqui o botão flutuante "Agendar" só atrapalha (cobre a fita de dias)
    if ($('.flutua')) $('.flutua').hidden = true;
    // no modo demo os dados chegam antes deste arquivo carregar
    if (CFG.barbeirosCarregados) preenche({ barbeiros: CFG.barbeirosCarregados, servicos: CFG.servicosCarregados });
    else document.addEventListener('tv:dados', function (ev) { preenche(ev.detail); });
  }

  /* ---- revelar ao rolar ---- */
  var itens = document.querySelectorAll('.revela');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(itens, function (n) { io.observe(n); });
  } else {
    Array.prototype.forEach.call(itens, function (n) { n.classList.add('visto'); });
  }
})();
