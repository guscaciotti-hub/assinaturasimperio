/* ==========================================================================
   Núcleo do timbrado A4 — Império Global (Evoluze)
   Opção 1 = arte APROVADA (PNG, logo achatado removido + logo vetorial por cima).
   Opções 2+ = variações CLEAN/PREMIUM vetoriais — cores BEM sutis (marca d'água)
   + logo vetorial oficial sobreposto (HTML). Tudo pronto p/ impressão.
   ========================================================================== */
(function (global) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var AZUL = '#013F80', SINAL = '#0072CE';

  function el(t, a){ var e=document.createElementNS(NS,t); if(a) for(var k in a) e.setAttribute(k,a[k]); return e; }

  function defs(){
    var d=el('defs');
    var pat=el('pattern',{id:'igpts',width:1.7,height:1.7,patternUnits:'userSpaceOnUse'});
    pat.appendChild(el('circle',{cx:0.85,cy:0.85,r:0.42,fill:AZUL})); d.appendChild(pat);
    // gradiente MUITO claro (marca d'água) para cantos/faixas
    var g=el('linearGradient',{id:'igsoft',x1:0,y1:1,x2:1,y2:0});
    g.appendChild(el('stop',{offset:0,'stop-color':'#DFEAF6'}));
    g.appendChild(el('stop',{offset:1,'stop-color':'#F3F8FC'})); d.appendChild(g);
    var gv=el('linearGradient',{id:'igsoftv',x1:0,y1:0,x2:0,y2:1});
    gv.appendChild(el('stop',{offset:0,'stop-color':'#CFE0F2'}));
    gv.appendChild(el('stop',{offset:1,'stop-color':'#EAF2FB'})); d.appendChild(gv);
    return d;
  }
  function base(){ var s=el('svg',{viewBox:'0 0 210 297',preserveAspectRatio:'none',width:'100%',height:'100%'}); s.appendChild(defs()); return s; }

  // ---- primitivas (todas discretas) ----
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
  function lineDot(x1,x2,y){
    var g=el('g');
    g.appendChild(el('line',{x1:x1,y1:y,x2:x2,y2:y,stroke:SINAL,'stroke-width':0.4,'stroke-opacity':0.5}));
    g.appendChild(el('circle',{cx:x2+1.4,cy:y,r:0.9,fill:SINAL,'fill-opacity':0.55})); return g;
  }
  function filete(y,x0,x1,op){ return el('rect',{x:x0,y:y,width:x1-x0,height:0.4,fill:SINAL,'fill-opacity':op||0.4}); }
  function poly(pts,fill,op){ return el('polygon',{points:pts,fill:fill,'fill-opacity':op}); }
  function ln(x1,y1,x2,y2,op){ return el('line',{x1:x1,y1:y1,x2:x2,y2:y2,stroke:SINAL,'stroke-width':0.4,'stroke-opacity':op||0.3}); }

  // cantos suaves (marca d'água): triângulo claro + fio finíssimo
  function cantoBR(sz){ sz=sz||58; var g=el('g');
    g.appendChild(poly('210,297 '+(210-sz)+',297 210,'+(297-sz),'url(#igsoft)',0.7));
    g.appendChild(ln(210-sz,297,210,297-sz,0.30)); return g; }
  function cantoTR(sz){ sz=sz||54; var g=el('g');
    g.appendChild(poly('210,0 '+(210-sz)+',0 210,'+sz,'url(#igsoft)',0.7));
    g.appendChild(ln(210-sz,0,210,sz,0.30)); return g; }
  function cantoTL(sz){ sz=sz||54; var g=el('g');
    g.appendChild(poly('0,0 '+sz+',0 0,'+sz,'url(#igsoft)',0.7));
    g.appendChild(ln(sz,0,0,sz,0.30)); return g; }
  function cantoBL(sz){ sz=sz||54; var g=el('g');
    g.appendChild(poly('0,297 '+sz+',297 0,'+(297-sz),'url(#igsoft)',0.7));
    g.appendChild(ln(sz,297,0,297-sz,0.30)); return g; }
  function barraEsq(){ return el('rect',{x:0,y:0,width:3.5,height:297,fill:'url(#igsoftv)','fill-opacity':0.85}); }
  function moldura(){ return el('rect',{x:11,y:11,width:188,height:275,fill:'none',stroke:SINAL,'stroke-width':0.4,'stroke-opacity':0.28}); }
  function cantosFinos(){ var g=el('g');
    // pequenos "colchetes" nos 4 cantos
    [[16,16,1],[194,16,-1],[16,281,1],[194,281,-1]].forEach(function(c){
      var x=c[0],y=c[1],d=c[2],L=10;
      g.appendChild(ln(x,y,x+d*L,y,0.30)); g.appendChild(ln(x,y,x,y+(y<150?L:-L),0.30));
    });
    return g;
  }

  var MODELOS = {
    '1': function(){ var s=base(); s.appendChild(globo(8,70,64,0.09)); s.appendChild(lineDot(20,120,22)); s.appendChild(mapa(105,190,1,0.12)); s.appendChild(cantoBR(58)); return s; },
    '2': function(){ var s=base(); s.appendChild(filete(46,55,155,0.4)); s.appendChild(globo(105,205,82,0.045)); return s; },
    '3': function(){ var s=base(); s.appendChild(lineDot(20,120,22)); s.appendChild(mapa(30,250,1.5,0.09)); return s; },
    '4': function(){ var s=base(); s.appendChild(filete(34,20,120,0.4)); s.appendChild(globo(-8,272,72,0.06)); s.appendChild(cantoBR(32)); return s; },
    '5': function(){ var s=base(); s.appendChild(barraEsq()); s.appendChild(globo(198,252,52,0.05)); s.appendChild(filete(34,16,120,0.4)); return s; },
    '6': function(){ var s=base(); s.appendChild(cantoTR(54)); s.appendChild(cantoBL(54)); s.appendChild(mapa(92,215,0.9,0.08)); return s; },
    '7': function(){ var s=base(); s.appendChild(filete(34,20,150,0.4)); s.appendChild(cantoBR(24)); return s; },
    // ---- PREMIUM ----
    '8':  function(){ var s=base(); s.appendChild(filete(30,20,190,0.35)); return s; },                                    // Filete (logo esq)
    '9':  function(){ var s=base(); s.appendChild(globo(105,178,88,0.04)); return s; },                                     // Água (globo central)
    '10': function(){ var s=base(); s.appendChild(mapa(72,172,1.2,0.06)); return s; },                                      // Mapa Água (centro)
    '11': function(){ var s=base(); s.appendChild(moldura()); return s; },                                                  // Moldura fina
    '12': function(){ var s=base(); s.appendChild(cantosFinos()); return s; },                                             // Cantos finos
    '13': function(){ var s=base(); s.appendChild(filete(30,30,180,0.35)); s.appendChild(filete(281,30,180,0.35)); return s; } // Duplo filete
  };

  var NOMES = { '1':'Aprovado','2':'Central','3':'Mapa','4':'Globo','5':'Faixa','6':'Cantos','7':'Minimal',
                '8':'Filete','9':'Água','10':'Mapa água','11':'Moldura','12':'Cantos finos','13':'Duplo filete' };
  var LOGO  = { '1':'dir','2':'centro','3':'dir','4':'dir','5':'dir','6':'esq','7':'dir',
                '8':'esq','9':'dir','10':'centro','11':'dir','12':'dir','13':'centro' };

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
    opcoes:['1','2','3','4','5','6','7','8','9','10','11','12','13'],
    nomes:NOMES,
    nome:function(op){ return NOMES[String(op)]||('Opção '+op); },
    logoPos:function(op){ return LOGO[String(op)]||'dir'; },
    arte:arte
  };
})(window);
