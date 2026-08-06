/* ==========================================================================
   Núcleo de renderização de assinaturas — Império Global (Evoluze)
   Extraído do gerador original. A saída (HTML da assinatura) é IDÊNTICA;
   a única diferença é que as funções recebem a configuração (cfg) como
   objecto, em vez de ler directamente dos campos do formulário. Assim o
   gerador e a página do cliente produzem exactamente a mesma assinatura.
   ========================================================================== */
(function (global) {
  'use strict';

  var LOGO  = global.IG_LOGO;
  var AZUL  = '#013F80', SINAL = '#0072CE', CORPO = '#79828D';
  var FF    = 'Arial,Helvetica,sans-serif';
  var DPI   = 96, CM = 2.54, RATIO = 2910 / 840;   // 96 dpi; ratio do logótipo vetorial oficial

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function slug(s) {
    return String(s || 'assinatura').normalize('NFD')
      .replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '').toLowerCase();
  }

  function cmParaPx(cm) { return Math.round(cm * DPI / CM); }

  function larguraCM(cfg) {
    var n = parseFloat(String(cfg.logoCM || '').replace(',', '.'));
    return (isNaN(n) || n <= 0) ? 4.5 : n;
  }
  function fatorEscala(cfg) {
    var n = parseFloat(String(cfg.escala || '').replace(',', '.'));
    return (isNaN(n) || n < 60 || n > 140) ? 92 : n;
  }

  // escala tipográfica base — compacta, calibrada para assinatura de e-mail
  function dim(cfg) {
    var e = fatorEscala(cfg) / 100;
    var r = function (b, min) { return Math.max(min || 1, Math.round(b * e)); };
    return {
      nome: r(17, 13), nomeLh: r(22), cargo: r(13, 11), cargoLh: r(17),
      corpo: r(12, 10), corpoLh: r(17), rod: r(9, 9), rodLh: r(13, 12),
      gap: r(22, 12), regua: r(3, 2), padV: r(18, 10), padH: r(22, 12),
      g1: r(3, 1), g2: r(7, 3), rodTop: r(13, 7), rodGap: r(9, 5),
      textW: r(292)   // largura FIXA da coluna de texto — IGUAL p/ todas; nome/função em destaque; texto longo quebra p/ baixo
    };
  }

  function linhasRodape(cfg, telOverride, semLegais, fr) {
    if (!cfg.usaRodape) return null;
    // rodapé: site · [NIF · Alvará] · telefone. Em FR: site · TVA <belga> · Tél.
    var site = String(cfg.site || '').replace(/^https?:\/\//, '');
    var telf = (telOverride && String(telOverride).trim()) ? String(telOverride).trim() : (fr ? '' : cfg.telGeral);
    var telLbl = fr ? 'Tél. ' : 'Telf. ';
    var beNum = cfg.nifBe || 'BE0771489302';
    var linha = (fr
      ? [ site || '', (!semLegais && beNum) ? 'TVA ' + beNum : '', telf ? telLbl + telf : '' ]
      : [ site || '', (!semLegais && cfg.nif) ? 'NIF/Matrícula ' + cfg.nif : '', (!semLegais && cfg.alvara) ? 'Alvará n.º ' + cfg.alvara : '', telf ? telLbl + telf : '' ]
    ).filter(Boolean).join(' · ');
    return linha ? [linha] : null;
  }

  function moldar(cfg, interno) {
    var d = dim(cfg);
    if (!cfg.usaMoldura) return interno;
    return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;background-color:#ffffff;border:1px solid #E5E8EC;border-radius:12px;">\n' +
      '<tr><td style="padding:' + d.padV + 'px ' + d.padH + 'px;">' + interno + '</td></tr>\n' +
      '</table>';
  }

  function montar(cfg, p) {
    var d = dim(cfg), lw = cmParaPx(larguraCM(cfg)), lh = Math.round(lw / RATIO);
    var site = String(cfg.site || '').replace(/^https?:\/\//, '');
    var emp = cfg.empresa || '';
    var tel = esc(p.tel), telHref = 'tel:' + String(p.tel || '').replace(/[^\d+]/g, '');
    return moldar(cfg, '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:#ffffff;">\n' +
'<tr>\n' +
'<td valign="middle" style="padding:0 ' + d.gap + 'px 0 0;">\n' +
'<img src="' + LOGO + '" alt="Império Global — Excellence in Telecommunications" width="' + lw + '" height="' + lh + '" style="display:block;border:0;outline:none;text-decoration:none;width:' + lw + 'px;height:' + lh + 'px;">\n' +
'</td>\n' +
'<td width="' + d.regua + '" bgcolor="' + SINAL + '" style="width:' + d.regua + 'px;min-width:' + d.regua + 'px;background-color:' + SINAL + ';font-size:0;line-height:0;">&nbsp;</td>\n' +
'<td valign="middle" width="' + d.textW + '" style="width:' + d.textW + 'px;max-width:' + d.textW + 'px;padding:0 0 0 ' + d.gap + 'px;">\n' +
'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="' + d.textW + '" style="border-collapse:collapse;width:' + d.textW + 'px;table-layout:fixed;">\n' +
'<tr><td style="padding:0 0 ' + d.g1 + 'px;font-family:' + FF + ';font-size:' + d.nome + 'px;line-height:' + d.nomeLh + 'px;font-weight:bold;color:' + AZUL + ';word-break:break-word;overflow-wrap:break-word;"><font color="' + AZUL + '" face="Arial">' + esc(p.nome) + '</font></td></tr>\n' +
'<tr><td style="font-family:' + FF + ';font-size:' + d.cargo + 'px;line-height:' + d.cargoLh + 'px;font-weight:bold;color:' + SINAL + ';word-break:break-word;overflow-wrap:break-word;"><font color="' + SINAL + '" face="Arial">' + esc(p.cargo) + '</font></td></tr>\n' +
'</table>\n' +
'</td>\n' +
'</tr>\n' +
(function () {
  if (!cfg.usaRodape) return '';
  var fr = (p.idioma === 'fr');          // Bélgica: rodapé em francês (nº belga no lugar do NIF, sem Alvará)
  var semLegais = !!p.esconder_legais;   // por pessoa: esconder o bloco legal (fica só site + telefone)
  // telefone: o da pessoa; em PT cai no número padrão da empresa se vazio; em FR fica vazio (nunca usa nº PT)
  var telRod = (p.tel && String(p.tel).trim()) ? String(p.tel).trim() : (fr ? '' : (cfg.telGeral || ''));
  var telLbl = fr ? 'Tél. ' : 'Telf. ';
  var inst = (fr
    ? [
        (!semLegais && cfg.nifBe) ? 'TVA ' + esc(cfg.nifBe) : '',
        telRod ? telLbl + esc(telRod) : ''
      ]
    : [
        (!semLegais && cfg.nif) ? 'NIF/Matrícula ' + esc(cfg.nif) : '',
        (!semLegais && cfg.alvara) ? 'Alvará n.º ' + esc(cfg.alvara) : '',
        telRod ? telLbl + esc(telRod) : ''
      ]
  ).filter(Boolean).join(' &middot; ');
  var siteFoot = site ? '<a href="https://' + site + '" style="color:#9AA3AD;text-decoration:none;">' + esc(site) + '</a>' : '';
  var conteudo = [siteFoot, inst].filter(Boolean).join(' &middot; ');
  return conteudo ? '<tr><td colspan="3" style="padding:' + d.rodTop + 'px 0 0;">\n' +
'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;">\n' +
'<tr><td style="border-top:1px solid #E1E7EC;padding:' + d.rodGap + 'px 0 0;font-family:' + FF + ';font-size:' + d.rod + 'px;line-height:' + d.rodLh + 'px;color:#9AA3AD;word-break:break-word;overflow-wrap:break-word;"><font color="#9AA3AD" face="Arial">' + conteudo + '</font></td></tr>\n' +
'</table>\n' +
'</td></tr>' : '';
})() +
'</table>');
  }

  global.IGCore = {
    LOGO: LOGO, AZUL: AZUL, SINAL: SINAL, CORPO: CORPO, FF: FF,
    DPI: DPI, CM: CM, RATIO: RATIO,
    esc: esc, slug: slug, cmParaPx: cmParaPx, larguraCM: larguraCM,
    fatorEscala: fatorEscala, dim: dim, linhasRodape: linhasRodape,
    moldar: moldar, montar: montar
  };
})(window);
