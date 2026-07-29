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
  var DPI   = 96, CM = 2.54, RATIO = 640 / 183;   // 96 dpi = padrão Outlook/web

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
      nome: r(15, 12), nomeLh: r(19), cargo: r(12, 10), cargoLh: r(15),
      corpo: r(12, 10), corpoLh: r(17), rod: r(9, 9), rodLh: r(13, 12),
      gap: r(20, 10), regua: r(3, 2), padV: r(16, 8), padH: r(20, 10),
      g1: r(2, 1), g2: r(6, 3), rodTop: r(12, 6), rodGap: r(8, 4)
    };
  }

  function linhasRodape(cfg) {
    if (!cfg.usaRodape) return null;
    var l1 = [cfg.mor1, cfg.mor2].filter(Boolean).join(' · ');
    var l2 = [
      cfg.telGeral ? 'Telf. ' + cfg.telGeral : '',
      cfg.nif ? 'NIF/Matrícula ' + cfg.nif : '',
      cfg.alvara ? 'Alvará n.º ' + cfg.alvara : ''
    ].filter(Boolean).join(' · ');
    var r = [l1, l2].filter(Boolean);
    return r.length ? r : null;
  }

  function moldar(cfg, interno) {
    var d = dim(cfg);
    if (!cfg.usaMoldura) return interno;
    return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;background-color:#ffffff;border:1px solid #E5E8EC;border-radius:12px;">\n' +
      '<tr><td style="padding:' + d.padV + 'px ' + d.padH + 'px;">' + interno + '</td></tr>\n' +
      '</table>';
  }

  function montar(cfg, p) {
    var d = dim(cfg), lw = cmParaPx(larguraCM(cfg));
    var site = String(cfg.site || '').replace(/^https?:\/\//, '');
    var emp = cfg.empresa || '';
    var tel = esc(p.tel), telHref = 'tel:' + String(p.tel || '').replace(/[^\d+]/g, '');
    return moldar(cfg, '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:#ffffff;">\n' +
'<tr>\n' +
'<td valign="middle" style="padding:0 ' + d.gap + 'px 0 0;">\n' +
'<img src="' + LOGO + '" alt="Império Global — Excellence in Telecommunications" width="' + lw + '" style="display:block;border:0;outline:none;text-decoration:none;width:' + lw + 'px;height:auto;">\n' +
'</td>\n' +
'<td width="' + d.regua + '" bgcolor="' + SINAL + '" style="width:' + d.regua + 'px;min-width:' + d.regua + 'px;background-color:' + SINAL + ';font-size:0;line-height:0;">&nbsp;</td>\n' +
'<td valign="middle" style="padding:0 0 0 ' + d.gap + 'px;">\n' +
'<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">\n' +
'<tr><td style="padding:0 0 ' + d.g1 + 'px;font-family:' + FF + ';font-size:' + d.nome + 'px;line-height:' + d.nomeLh + 'px;font-weight:bold;color:' + AZUL + ';">' + esc(p.nome) + '</td></tr>\n' +
'<tr><td style="padding:0 0 ' + d.g2 + 'px;font-family:' + FF + ';font-size:' + d.cargo + 'px;line-height:' + d.cargoLh + 'px;font-weight:bold;color:' + SINAL + ';">' + esc(p.cargo) + '</td></tr>\n' +
'<tr><td style="font-family:' + FF + ';font-size:' + d.corpo + 'px;line-height:' + d.corpoLh + 'px;color:' + CORPO + ';">\n' +
esc(emp) + '<br>\n' +
'<a href="mailto:' + esc(p.email) + '" style="color:' + CORPO + ';text-decoration:none;">' + esc(p.email) + '</a>' + (tel ? ' &middot; <a href="' + telHref + '" style="color:' + CORPO + ';text-decoration:none;">' + tel + '</a>' : '') + '<br>\n' +
'<a href="https://' + site + '" style="color:' + CORPO + ';text-decoration:none;">' + site + '</a>\n' +
'</td></tr>\n' +
'</table>\n' +
'</td>\n' +
'</tr>\n' +
(function () {
  var r = linhasRodape(cfg);
  return r ? '<tr><td colspan="3" style="padding:' + d.rodTop + 'px 0 0;">\n' +
'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;">\n' +
'<tr><td height="1" bgcolor="#E1E7EC" style="height:1px;line-height:1px;font-size:0;background-color:#E1E7EC;">&nbsp;</td></tr>\n' +
'<tr><td style="padding:' + d.rodGap + 'px 0 0;font-family:' + FF + ';font-size:' + d.rod + 'px;line-height:' + d.rodLh + 'px;color:#9AA3AD;">' + r.map(esc).join('<br>') + '</td></tr>\n' +
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
