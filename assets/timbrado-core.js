/* ==========================================================================
   Núcleo do timbrado A4 — Império Global (Evoluze)
   Opção 1 = arte APROVADA (PNG, logo achatado removido + logo vetorial por cima).
   Opções 2+ = variações CLEAN vetoriais (globo, mapa pontilhado, canto azul,
   linha fina) + logo vetorial oficial sobreposto (HTML). Tudo pronto p/ impressão.
   ========================================================================== */
(function (global) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var AZUL = '#013F80', SINAL = '#0072CE';

  function el(t, a){ var e=document.createElementNS(NS,t); if(a) for(var k in a) e.setAttribute(k,a[k]); return e; }

  // ---------- primitivas ----------
  function defsComuns(){
    var defs=el('defs');
    var pat=el('pattern',{id:'igpts',width:1.7,height:1.7,patternUnits:'userSpaceOnUse'});
    pat.appendChild(el('circle',{cx:0.85,cy:0.85,r:0.42,fill:AZUL})); defs.appendChild(pat);
    var g1=el('linearGradient',{id:'igcg',x1:0,y1:1,x2:1,y2:0});
    g1.appendChild(el('stop',{offset:0,'stop-color':'#BFD4EC'}));
    g1.appendChild(el('stop',{offset:1,'stop-color':'#E8F0F9'})); defs.appendChild(g1);
    var g2=el('linearGradient',{id:'igv',x1:0,y1:0,x2:0,y2:1});
    g2.appendChild(el('stop',{offset:0,'stop-color':AZUL}));
    g2.appendChild(el('stop',{offset:1,'stop-color':SINAL})); defs.appendChild(g2);
    return defs;
  }
  function globo(cx,cy,R,op){
    var g=el('g',{stroke:AZUL,fill:'none','stroke-opacity':op});
    g.appendChild(el('circle',{cx:cx,cy:cy,r:R,'stroke-width':R*0.008}));
    [0.30,0.60,0.85].forEach(function(f){ g.appendChild(el('ellipse',{cx:cx,cy:cy,rx:R*f,ry:R,'stroke-width':R*0.006})); });
    g.appendChild(el('ellipse',{cx:cx,cy:cy,rx:R,ry:R,'stroke-width':R*0.008}));
    [0.32,0.62,0.85].forEach(function(f){ [-1,1].forEach(function(s){
      g.appendChild(el('ellipse',{cx:cx,cy:cy+s*R*f,rx:R*Math.cos(Math.asin(f)),ry:R*0.02,'stroke-width':R*0.006})); }); });
    g.appendChild(el('ellipse',{cx:cx,cy:cy,rx:R,ry:R*0.14,'stroke-width':R*0.006}));
    g.appendChild(el('line',{x1:cx,y1:cy-R,x2:cx,y2:cy+R,'stroke-width':R*0.006}));
    return g;
  }
  function mapa(tx,ty,sc,op){
    var g=el('g',{fill:'url(#igpts)','fill-opacity':op,transform:'translate('+tx+' '+ty+') scale('+sc+')'});
    [[0,6,17,12,-8],[14,38,7,14,10],[36,-6,8,6,0],[45,18,12,16,-4],[69,0,24,13,-6],[66,-19,9,5,0],[83,34,9,5,0]]
      .forEach(function(c){ g.appendChild(el('ellipse',{cx:c[0],cy:c[1],rx:c[2],ry:c[3],transform:'rotate('+c[4]+' '+c[0]+' '+c[1]+')'})); });
    return g;
  }
  function lineDot(x1,x2,y,r){
    var g=el('g');
    g.appendChild(el('line',{x1:x1,y1:y,x2:x2,y2:y,stroke:SINAL,'stroke-width':0.5,'stroke-opacity':0.9}));
    g.appendChild(el('circle',{cx:x2+r+0.6,cy:y,r:r,fill:SINAL})); return g;
  }
  function filete(y,x0,x1){ return el('rect',{x:x0,y:y,width:x1-x0,height:0.5,fill:SINAL,'fill-opacity':0.6}); }
  function poly(pts,fill,op){ return el('polygon',{points:pts,fill:fill,'fill-opacity':op}); }
  function cantoBR(sz){ sz=sz||60; var g=el('g');
    g.appendChild(poly('210,297 '+(210-sz)+',297 210,'+(297-sz),'url(#igcg)',0.85));
    g.appendChild(poly('210,297 '+(210-sz*0.42)+',297 210,'+(297-sz*0.42),'#9CBBE0',0.75));
    g.appendChild(poly('210,297 '+(210-sz*0.16)+',297 210,'+(297-sz*0.16),AZUL,0.55)); return g; }
  function cantoTL(sz){ sz=sz||56; var g=el('g');
    g.appendChild(poly('0,0 '+sz+',0 0,'+sz,'url(#igcg)',0.85));
    g.appendChild(poly('0,0 '+sz*0.55+',0 0,'+sz*0.5,'#9CBBE0',0.75)); return g; }
  function cantoTR(sz){ sz=sz||56; var g=el('g');
    g.appendChild(poly('210,0 '+(210-sz)+',0 210,'+sz,'url(#igcg)',0.85));
    g.appendChild(poly('210,0 '+(210-sz*0.55)+',0 210,'+sz*0.5,'#9CBBE0',0.75)); return g; }
  function cantoBL(sz){ sz=sz||56; var g=el('g');
    g.appendChild(poly('0,297 '+sz+',297 0,'+(297-sz),'url(#igcg)',0.85));
    g.appendChild(poly('0,297 '+sz*0.55+',297 0,'+(297-sz*0.5),'#9CBBE0',0.75)); return g; }
  function barraEsq(){ return el('rect',{x:0,y:0,width:5,height:297,fill:'url(#igv)','fill-opacity':0.9}); }

  function base(){ var s=el('svg',{viewBox:'0 0 210 297',preserveAspectRatio:'none',width:'100%',height:'100%'}); s.appendChild(defsComuns()); return s; }

  // ---------- opções ----------
  var MODELOS = {
    // 1 tratado à parte (imagem aprovada). Definido aqui só como fallback vetorial.
    '1': function(){ var s=base(); s.appendChild(globo(8,70,64,0.10)); s.appendChild(lineDot(20,120,22,1.1)); s.appendChild(mapa(105,190,1,0.16)); s.appendChild(cantoBR(60)); return s; },
    // 2 — CENTRAL (formal, muito clean): logo centrado, filete simétrico, globo grande leve ao fundo
    '2': function(){ var s=base(); s.appendChild(filete(46,55,155)); s.appendChild(globo(105,205,82,0.05)); return s; },
    // 3 — MAPA: logo dir + linha/ponto, mapa pontilhado em banda no rodapé
    '3': function(){ var s=base(); s.appendChild(lineDot(20,120,22,1.1)); s.appendChild(mapa(30,250,1.5,0.12)); return s; },
    // 4 — GLOBO: logo dir, filete no topo, globo grande a sangrar no canto inferior-esq
    '4': function(){ var s=base(); s.appendChild(filete(34,20,120)); s.appendChild(globo(-8,272,72,0.08)); s.appendChild(cantoBR(34)); return s; },
    // 5 — FAIXA LATERAL: barra azul fina à esquerda, logo dir, globo leve inf-dir
    '5': function(){ var s=base(); s.appendChild(barraEsq()); s.appendChild(globo(198,252,52,0.06)); s.appendChild(filete(34,16,120)); return s; },
    // 6 — CANTOS: logo esq, cantos azuis (topo-dir + inf-esq), mapa leve ao centro
    '6': function(){ var s=base(); s.appendChild(cantoTR(56)); s.appendChild(cantoBL(56)); s.appendChild(mapa(92,215,0.9,0.10)); return s; },
    // 7 — MINIMAL: logo dir, filete fino no topo, pequeno canto azul inf-dir
    '7': function(){ var s=base(); s.appendChild(filete(34,20,150)); s.appendChild(cantoBR(26)); return s; }
  };

  var NOMES  = { '1':'Aprovado','2':'Central','3':'Mapa','4':'Globo','5':'Faixa','6':'Cantos','7':'Minimal' };
  var LOGO   = { '1':'dir','2':'centro','3':'dir','4':'dir','5':'dir','6':'esq','7':'dir' };

  function arte(op){
    op=String(op);
    if(op==='1'){
      var img=document.createElement('img');
      img.src='assets/timbrado-op1.png?v=24';
      img.alt='Papel timbrado Império Global';
      img.setAttribute('style','position:absolute;top:0;left:0;width:100%;height:auto;display:block;');
      return img;
    }
    return (MODELOS[op]||MODELOS['2'])();
  }

  global.IGTimbrado = {
    AZUL:AZUL, SINAL:SINAL,
    opcoes:['1','2','3','4','5','6','7'],
    nomes:NOMES,
    nome:function(op){ return NOMES[String(op)]||('Opção '+op); },
    logoPos:function(op){ return LOGO[String(op)]||'dir'; },
    arte:arte
  };
})(window);
