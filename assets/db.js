/* ==========================================================================
   Camada de dados — Supabase.

   As assinaturas ficam trancadas no banco (RLS sem leitura direta). Todo o
   acesso passa por funções controladas:
     - ig_listar(chave)          -> todas as assinaturas (só com chave)
     - ig_get_por_token(token)   -> uma assinatura (link individual, público)
     - ig_guardar_pessoa(...,chave) / ig_remover(id, chave) -> exigem chave de escrita
     - ig_chaves(chave_escrita)  -> devolve a chave de leitura (para o link da cliente)

   A CHAVE DE ESCRITA fica guardada só no navegador de quem usa o gerador
   (localStorage), nunca no código-fonte.
   ========================================================================== */
(function (global) {
  'use strict';

  var SUPABASE_URL = 'https://gmycqvvvglexbtbqkjzi.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdteWNxdnZ2Z2xleGJ0YnFranppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjU1NjksImV4cCI6MjA5MzE0MTU2OX0.EZ1kmm1fcIMyQ4ALlBYhmtYeE26712ePH7HQOPkc_yQ';

  if (!global.supabase || !global.supabase.createClient) {
    throw new Error('supabase-js não carregou');
  }
  var sb = global.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // -------- chave de escrita (guardada só neste navegador) --------
  var WKEY = 'ig_write_key';
  function getKey() { try { return (localStorage.getItem(WKEY) || '').trim(); } catch (e) { return ''; } }
  function setKey(k) { try { localStorage.setItem(WKEY, (k || '').trim()); } catch (e) {} }

  // -------- mapeamento config (snake_case DB <-> camelCase app) --------
  function rowToCfg(r) {
    r = r || {};
    return {
      logoCM: r.logo_cm != null ? r.logo_cm : '4,5',
      site: r.site != null ? r.site : 'imperioglobal.eu',
      escala: r.escala != null ? r.escala : '92',
      empresa: r.empresa != null ? r.empresa : 'Império Global Telecomunicações',
      usaRodape: r.usa_rodape != null ? !!r.usa_rodape : true,
      usaMoldura: r.usa_moldura != null ? !!r.usa_moldura : true,
      mor1: r.mor1 != null ? r.mor1 : '',
      mor2: r.mor2 != null ? r.mor2 : '',
      telGeral: r.tel_geral != null ? r.tel_geral : '',
      nif: r.nif != null ? r.nif : '',
      alvara: r.alvara != null ? r.alvara : ''
    };
  }
  function cfgToRow(c) {
    return {
      id: 1,
      logo_cm: c.logoCM, site: c.site, escala: c.escala, empresa: c.empresa,
      usa_rodape: !!c.usaRodape, usa_moldura: !!c.usaMoldura,
      mor1: c.mor1, mor2: c.mor2, tel_geral: c.telGeral, nif: c.nif, alvara: c.alvara,
      updated_at: new Date().toISOString()
    };
  }

  // ordena por código natural (IG-001, IG-002, ...)
  function ordenar(lista) {
    return (lista || []).slice().sort(function (a, b) {
      return String(a.codigo).localeCompare(String(b.codigo), 'pt', { numeric: true });
    });
  }

  var IGDB = {
    client: sb,
    getKey: getKey,
    setKey: setKey,

    getConfig: function () {
      return sb.from('ig_config').select('*').eq('id', 1).maybeSingle()
        .then(function (res) { if (res.error) throw res.error; return rowToCfg(res.data); });
    },

    saveConfig: function (cfg) {
      return sb.from('ig_config').upsert(cfgToRow(cfg), { onConflict: 'id' })
        .then(function (res) { if (res.error) throw res.error; return true; });
    },

    // todas as assinaturas — exige chave de leitura ou escrita
    list: function (key) {
      var k = (key != null) ? String(key) : getKey();
      return sb.rpc('ig_listar', { p_key: k })
        .then(function (res) { if (res.error) throw res.error; return ordenar(res.data || []); });
    },

    // uma assinatura pelo token (link individual, público)
    porToken: function (token) {
      return sb.rpc('ig_get_por_token', { p_token: token })
        .then(function (res) { if (res.error) throw res.error; var d = res.data || []; return d.length ? d[0] : null; });
    },

    // chave de leitura (para montar o link da cliente) — precisa da chave de escrita
    readKey: function () {
      return sb.rpc('ig_chaves', { p_key: getKey() })
        .then(function (res) { if (res.error) throw res.error; var d = res.data || []; return d.length ? d[0].read_key : null; });
    },

    // upsert por e-mail com código sequencial atómico (RPC no banco)
    guardar: function (p) {
      return sb.rpc('ig_guardar_pessoa', {
        p_nome: p.nome || '',
        p_cargo: p.cargo || '',
        p_email: p.email || '',
        p_tel: p.tel || '',
        p_codigo: (p.codigo || '').trim() || null,
        p_key: getKey()
      }).then(function (res) {
        if (res.error) throw res.error;
        return Array.isArray(res.data) ? res.data[0] : res.data;
      });
    },

    remover: function (id) {
      return sb.rpc('ig_remover', { p_id: id, p_key: getKey() })
        .then(function (res) { if (res.error) throw res.error; return true; });
    },

    // controlo de envio (master): marca/desmarca uma assinatura como enviada
    marcarEnviado: function (codigo, enviado, key) {
      var k = (key != null) ? String(key) : getKey();
      return sb.rpc('ig_marcar_enviado', { p_codigo: codigo, p_enviado: !!enviado, p_key: k })
        .then(function (res) { if (res.error) throw res.error; return true; });
    }
  };

  global.IGDB = IGDB;
})(window);
