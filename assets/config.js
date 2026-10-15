/* =====================================================================
   Salão Alvany · Federação — configuração
   Único arquivo que precisa ser editado para o site sair do modo de
   demonstração e entrar no ar de verdade.
   ===================================================================== */

window.TV = {

  /* ---- Negócio ---------------------------------------------------- */
  nome:       'Salão Alvany',
  slogan:     'Cabelo saudável na Federação',
  // A CONFIRMAR: o Instagram ainda é o da época da parceria com a Amávia.
  instagram:  'amavia_federacao',

  // WhatsApp da bio do Instagram, conferido em 15/10/2026.
  whatsapp:        '5571987547024',
  whatsappVisivel: '(71) 98754-7024',

  // A CONFIRMAR: falta rua, número e ponto de referência.
  endereco: {
    linha1: 'Federação · Salvador, BA',
    linha2: 'Endereço completo enviado na confirmação',
    maps:   'https://www.google.com/maps/search/?api=1&query=Federa%C3%A7%C3%A3o+Salvador+BA',
    busca:  'Federação, Salvador - BA'
  },

  /* ---- Supabase ---------------------------------------------------
     Enquanto estes dois campos estiverem vazios, o site roda em MODO
     DEMONSTRAÇÃO: a agenda funciona de verdade na tela, mas os horários
     ficam guardados só no navegador de quem está olhando.
     Passo a passo para ligar: README.md.
  ------------------------------------------------------------------ */
  supabaseUrl: '',
  supabaseKey: '',

  /* ---- Regras da agenda (espelham o db/schema.sql) ---------------- */
  regras: {
    passoMin:        30,
    antecedenciaMin: 60,
    janelaDias:      30,
    cancelamentoH:   2,
    manutencaoDias:  30    // retorno padrão quando o serviço não define o seu
  },

  /* ---- Expediente (0 = domingo) ------------------------------------
     A CONFIRMAR com a Alvani. Seg a sáb, 9h às 18h é provisório.
  ------------------------------------------------------------------ */
  expediente: {
    0: { aberto: false },
    1: { aberto: true, abre: '09:00', fecha: '18:00' },
    2: { aberto: true, abre: '09:00', fecha: '18:00' },
    3: { aberto: true, abre: '09:00', fecha: '18:00' },
    4: { aberto: true, abre: '09:00', fecha: '18:00' },
    5: { aberto: true, abre: '09:00', fecha: '18:00' },
    6: { aberto: true, abre: '09:00', fecha: '18:00' }
  },

  /* ---- Dados usados no modo demonstração --------------------------
     No ar de verdade, profissionais e serviços vêm do banco.
     Com uma profissional só, o passo "com quem" some sozinho. Entrou
     outra cabeleireira no banco? O passo volta, sem mexer no código.
  ------------------------------------------------------------------ */
  barbeirosDemo: [
    { id:'alvani', slug:'alvani', nome:'Alvani', cargo:'Cabeleireira e dona do salão', foto:'', instagram:'amavia_federacao' }
  ],

  // Tabela de preços do balcão (foto enviada pelo Natham em 15/10/2026).
  // Todos os valores são "a partir de": o preço final depende do comprimento e do volume.
  // Durações estimadas, a confirmar. retorno_dias: depois de quantos dias o painel
  // sugere chamar a cliente de volta (0 = não chama).
  servicosDemo: [
    { id:'permanente-afro',  nome:'Permanente',                 descricao:'Alisamento definitivo para cabelo crespo e cacheado, com o fio tratado antes e depois da química. Resultado liso, com brilho e movimento.', preco_centavos:20000, a_partir_de:true, duracao_min:180, retorno_dias:60, categoria:'Assinatura' },
    { id:'progressiva',      nome:'Progressiva',                descricao:'Alinha o fio, reduz o volume e tira o frizz por meses.', preco_centavos:18000, a_partir_de:true, duracao_min:180, retorno_dias:90, categoria:'Química e alisamento' },
    { id:'selagem',          nome:'Selagem',                    descricao:'Sela a cutícula e deixa o cabelo alinhado e brilhante, com menos química que a progressiva.', preco_centavos:16000, a_partir_de:true, duracao_min:150, retorno_dias:90, categoria:'Química e alisamento' },
    { id:'botox',            nome:'Botox capilar',              descricao:'Repõe massa no fio, sela a cutícula e tira o frizz. Ótimo entre uma química e outra.', preco_centavos:13000, a_partir_de:true, duracao_min:120, retorno_dias:45, categoria:'Química e alisamento' },
    { id:'soltura-cacho',    nome:'Soltura de cacho',           descricao:'Afrouxa a curvatura e deixa o cacho mais aberto e fácil de cuidar, sem alisar.', preco_centavos:15000, a_partir_de:true, duracao_min:150, retorno_dias:60, categoria:'Cachos' },
    { id:'cachoterapia',     nome:'Cachoterapia',               descricao:'Tratamento e finalização para o cacho ficar definido, hidratado e sem frizz.', preco_centavos:7000, a_partir_de:true, duracao_min:90, retorno_dias:30, categoria:'Cachos' },
    { id:'cauterizacao',     nome:'Cauterização',               descricao:'Reconstrução que fecha a cutícula e devolve força ao fio danificado por química e calor.', preco_centavos:12000, a_partir_de:true, duracao_min:90, retorno_dias:30, categoria:'Tratamentos' },
    { id:'algas',            nome:'Algas',                      descricao:'Tratamento com algas que nutre e devolve maciez e brilho.', preco_centavos:9000, a_partir_de:true, duracao_min:60, retorno_dias:30, categoria:'Tratamentos' },
    { id:'algas-escova',     nome:'Algas com escova',           descricao:'O tratamento com algas, já finalizado com escova.', preco_centavos:13000, a_partir_de:true, duracao_min:90, retorno_dias:30, categoria:'Tratamentos' },
    { id:'aplicacao-produto',nome:'Aplicação de produto',       descricao:'Comprou o produto aqui? A gente aplica na hora, do jeito certo.', preco_centavos:10000, a_partir_de:true, duracao_min:60, retorno_dias:30, categoria:'Tratamentos' },
    { id:'coloracao-aplicacao', nome:'Aplicação de coloração',  descricao:'Você traz a sua tinta e a gente aplica.', preco_centavos:5000, a_partir_de:true, duracao_min:60, retorno_dias:40, categoria:'Cor' },
    { id:'coloracao-casa',   nome:'Coloração com tinta da casa',descricao:'Coloração com o produto do salão.', preco_centavos:8000, a_partir_de:true, duracao_min:90, retorno_dias:40, categoria:'Cor' },
    { id:'coloracao-todo',   nome:'Coloração do cabelo todo',   descricao:'Cor uniforme da raiz às pontas: do castanho ao marsala.', preco_centavos:12000, a_partir_de:true, duracao_min:120, retorno_dias:40, categoria:'Cor' },
    { id:'corte',            nome:'Corte',                      descricao:'Corte com finalização simples.', preco_centavos:5000, a_partir_de:true, duracao_min:60, retorno_dias:45, categoria:'Corte e finalização' },
    { id:'escova',           nome:'Escova',                     descricao:'Lavagem e escova modelada.', preco_centavos:5000, a_partir_de:true, duracao_min:60, retorno_dias:0, categoria:'Corte e finalização' }
  ]
};

/* O que a Alvani ajusta na aba "Serviços" do painel fica guardado neste
   aparelho enquanto o site está em demonstração, e vale aqui também. */
(function () {
  var T = window.TV, ajustes = {};
  try { ajustes = JSON.parse(localStorage.getItem('av_servicos_demo') || '{}') || {}; } catch (e) {}
  T.servicosDemoTodos = T.servicosDemo.map(function (s) {
    var a = ajustes[s.id] || {}, n = {};
    for (var k in s) n[k] = s[k];
    if (a.preco_centavos != null) n.preco_centavos = a.preco_centavos;
    if (a.duracao_min) n.duracao_min = a.duracao_min;
    if (a.a_partir_de != null) n.a_partir_de = a.a_partir_de;
    n.ativo = a.ativo !== false;
    return n;
  });
  T.servicosDemo = T.servicosDemoTodos.filter(function (s) { return s.ativo; });
})();

window.TV.modoDemo = !(window.TV.supabaseUrl && window.TV.supabaseKey);
