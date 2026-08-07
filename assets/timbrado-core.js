/* ==========================================================================
   Núcleo do timbrado A4 — Império Global (Evoluze)
   Toda a arte é VETORIAL (SVG) => nítida em qualquer impressora/DPI.
   4 opções de modelo. A Opção 1 reproduz o modelo aprovado pela cliente.
   Usado pela página interna (configurar) e pela página da cliente (baixar PDF).
   ========================================================================== */
(function (global) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var AZUL = '#013F80', SINAL = '#0072CE';

  function el(t, a) {
    var e = document.createElementNS(NS, t);
    if (a) for (var k in a) e.setAttribute(k, a[k]);
    return e;
  }

  // ---------- primitivas ----------
  function defsComuns() {
    var defs = el('defs');
    var pat = el('pattern', { id: 'igpts', width: 1.7, height: 1.7, patternUnits: 'userSpaceOnUse' });
    pat.appendChild(el('circle', { cx: 0.85, cy: 0.85, r: 0.42, fill: AZUL }));
    defs.appendChild(pat);
    var g1 = el('linearGradient', { id: 'igcg', x1: 0, y1: 1, x2: 1, y2: 0 });
    g1.appendChild(el('stop', { offset: 0, 'stop-color': '#BFD4EC' }));
    g1.appendChild(el('stop', { offset: 1, 'stop-color': '#E8F0F9' }));
    defs.appendChild(g1);
    return defs;
  }

  // globo em wireframe (meridianos/paralelos) — como o do logótipo
  function globo(cx, cy, R, op) {
    var g = el('g', { stroke: AZUL, fill: 'none', 'stroke-opacity': op });
    g.appendChild(el('circle', { cx: cx, cy: cy, r: R, 'stroke-width': R * 0.008 }));
    [0.30, 0.60, 0.85].forEach(function (f) {
      g.appendChild(el('ellipse', { cx: cx, cy: cy, rx: R * f, ry: R, 'stroke-width': R * 0.006 }));
    });
    g.appendChild(el('ellipse', { cx: cx, cy: cy, rx: R, ry: R, 'stroke-width': R * 0.008 }));
    [0.32, 0.62, 0.85].forEach(function (f) {
      [-1, 1].forEach(function (s) {
        g.appendChild(el('ellipse', { cx: cx, cy: cy + s * R * f, rx: R * Math.cos(Math.asin(f)), ry: R * 0.02, 'stroke-width': R * 0.006 }));
      });
    });
    g.appendChild(el('ellipse', { cx: cx, cy: cy, rx: R, ry: R * 0.14, 'stroke-width': R * 0.006 }));
    g.appendChild(el('line', { x1: cx, y1: cy - R, x2: cx, y2: cy + R, 'stroke-width': R * 0.006 }));
    return g;
  }

  // mapa-múndi pontilhado (blobs de continentes com padrão de pontos)
  // tx,ty,sc = translação e escala (para posicionar/redimensionar)
  function mapa(tx, ty, sc, op) {
    var g = el('g', { fill: 'url(#igpts)', 'fill-opacity': op, transform: 'translate(' + tx + ' ' + ty + ') scale(' + sc + ')' });
    [[0, 6, 17, 12, -8], [14, 38, 7, 14, 10], [36, -6, 8, 6, 0],
     [45, 18, 12, 16, -4], [69, 0, 24, 13, -6], [66, -19, 9, 5, 0], [83, 34, 9, 5, 0]
    ].forEach(function (c) {
      g.appendChild(el('ellipse', { cx: c[0], cy: c[1], rx: c[2], ry: c[3], transform: 'rotate(' + c[4] + ' ' + c[0] + ' ' + c[1] + ')' }));
    });
    return g;
  }

  function lineDot(x1, x2, y, r) {
    var g = el('g');
    g.appendChild(el('line', { x1: x1, y1: y, x2: x2, y2: y, stroke: SINAL, 'stroke-width': 0.5, 'stroke-opacity': 0.9 }));
    g.appendChild(el('circle', { cx: x2 + r + 0.6, cy: y, r: r, fill: SINAL }));
    return g;
  }

  function cantoBR() {
    var g = el('g');
    g.appendChild(el('polygon', { points: '150,297 210,238 210,297', fill: 'url(#igcg)', 'fill-opacity': 0.85 }));
    g.appendChild(el('polygon', { points: '176,297 210,264 210,297', fill: '#9CBBE0', 'fill-opacity': 0.75 }));
    g.appendChild(el('polygon', { points: '198,297 210,286 210,297', fill: AZUL, 'fill-opacity': 0.55 }));
    g.appendChild(el('line', { x1: 150, y1: 297, x2: 210, y2: 238, stroke: SINAL, 'stroke-width': 0.5, 'stroke-opacity': 0.5 }));
    return g;
  }
  function cantoTL() {
    var g = el('g');
    g.appendChild(el('polygon', { points: '0,0 60,0 0,52', fill: 'url(#igcg)', 'fill-opacity': 0.85 }));
    g.appendChild(el('polygon', { points: '0,0 34,0 0,30', fill: '#9CBBE0', 'fill-opacity': 0.75 }));
    return g;
  }
  function filete(y, simetrico) {
    return el('rect', simetrico
      ? { x: 45, y: y, width: 120, height: 0.5, fill: SINAL, 'fill-opacity': 0.6 }
      : { x: 20, y: y, width: 100, height: 0.5, fill: SINAL, 'fill-opacity': 0.6 });
  }

  // ---------- as 4 opções ----------
  function base() {
    var svg = el('svg', { viewBox: '0 0 210 297', preserveAspectRatio: 'none', width: '100%', height: '100%' });
    svg.appendChild(defsComuns());
    return svg;
  }

  var MODELOS = {
    // 1 — MODELO APROVADO: linha+ponto -> logo (dir), globo a sangrar (sup-esq),
    //     mapa pontilhado (inf-centro/dir), canto azul (inf-dir).
    '1': function () {
      var s = base();
      s.appendChild(globo(8, 70, 64, 0.10));
      s.appendChild(lineDot(20, 120, 22, 1.1));
      s.appendChild(mapa(105, 190, 1, 0.16));
      s.appendChild(cantoBR());
      return s;
    },
    // 2 — SIMÉTRICO / LIMPO: filete central sob o logo (centrado), globo grande
    //     ao fundo como marca de água central, sem mapa, cantos discretos.
    '2': function () {
      var s = base();
      s.appendChild(filete(40, true));
      s.appendChild(globo(105, 175, 78, 0.06));
      s.appendChild(el('polygon', { points: '0,297 40,297 0,258', fill: 'url(#igcg)', 'fill-opacity': 0.7 }));
      s.appendChild(el('polygon', { points: '170,297 210,297 210,258', fill: 'url(#igcg)', 'fill-opacity': 0.7 }));
      return s;
    },
    // 3 — MAPA EM DESTAQUE: canto azul no topo-esq, logo (dir), mapa pontilhado
    //     largo no terço inferior, globo pequeno inf-esq.
    '3': function () {
      var s = base();
      s.appendChild(cantoTL());
      s.appendChild(filete(30, false));
      s.appendChild(mapa(58, 232, 1.35, 0.14));
      s.appendChild(globo(18, 250, 34, 0.09));
      return s;
    },
    // 4 — MINIMAL: filete no topo + pequeno canto azul (inf-dir). Bem limpo.
    '4': function () {
      var s = base();
      s.appendChild(filete(34, false));
      s.appendChild(el('polygon', { points: '186,297 210,297 210,272', fill: 'url(#igcg)', 'fill-opacity': 0.8 }));
      s.appendChild(el('polygon', { points: '198,297 210,297 210,284', fill: AZUL, 'fill-opacity': 0.5 }));
      return s;
    }
  };

  function arte(op) {
    op = String(op);
    // Opção 1 = arte APROVADA da cliente (imagem final, idêntica). As outras são variações vetoriais.
    if (op === '1') {
      var img = document.createElement('img');
      img.src = 'assets/timbrado-op1.png?v=19';
      img.alt = 'Papel timbrado Império Global';
      img.setAttribute('style', 'position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:cover;object-position:center;');
      return img;
    }
    return (MODELOS[op] || MODELOS['2'])();
  }

  global.IGTimbrado = {
    AZUL: AZUL, SINAL: SINAL,
    opcoes: ['1', '2', '3', '4'],
    arte: arte
  };
})(window);
