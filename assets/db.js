/* ==========================================================================
   Camada de dados — Supabase. As entregas e a configuração ficam guardadas
   no banco (não no navegador), por isso não se perdem entre computadores,
   navegadores ou limpezas de cache.
   ========================================================================== */
(function (global) {
  'use strict';

  var SUPABASE_URL = 'https://gmycqvvvglexbtbqkjzi.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdteWNxdnZ2Z2xleGJ0YnFranppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NjU1NjksImV4cCI6MjA5MzE0MTU2OX0.EZ1kmm1fcIMyQ4ALlBYhmtYeE26712ePH7HQOPkc_yQ';

  if (!global.supabase || !global.supabase.createClient) {
    throw new Error('supabase-js não carregou');
  }
  var sb = global.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

  // ordena por código de forma natural (IG-001, IG-002, ...), como no original
  function ordenar(lista) {
    return (lista || []).slice().sort(function (a, b) {
      return String(a.codigo).localeCompare(String(b.codigo), 'pt', { numeric: true });
    });
  }

  var IGDB = {
    client: sb,

    getConfig: function () {
      return sb.from('ig_config').select('*').eq('id', 1).maybeSingle()
        .then(function (res) {
          if (res.error) throw res.error;
          return rowToCfg(res.data);
        });
    },

    saveConfig: function (cfg) {
      return sb.from('ig_config').upsert(cfgToRow(cfg), { onConflict: 'id' })
        .then(function (res) { if (res.error) throw res.error; return true; });
    },

    list: function () {
      return sb.from('ig_assinaturas').select('*')
        .then(function (res) {
          if (res.error) throw res.error;
          return ordenar(res.data);
        });
    },

    // upsert por e-mail com código sequencial atómico (RPC no banco)
    guardar: function (p) {
      return sb.rpc('ig_guardar_pessoa', {
        p_nome: p.nome || '',
        p_cargo: p.cargo || '',
        p_email: p.email || '',
        p_tel: p.tel || '',
        p_codigo: (p.codigo || '').trim() || null
      }).then(function (res) {
        if (res.error) throw res.error;
        return Array.isArray(res.data) ? res.data[0] : res.data;
      });
    },

    remover: function (id) {
      return sb.from('ig_assinaturas').delete().eq('id', id)
        .then(function (res) { if (res.error) throw res.error; return true; });
    },

    removerPorCodigo: function (codigo) {
      return sb.from('ig_assinaturas').delete().eq('codigo', codigo)
        .then(function (res) { if (res.error) throw res.error; return true; });
    }
  };

  global.IGDB = IGDB;
})(window);
