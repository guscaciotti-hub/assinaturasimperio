# Assinaturas — Império Global (Evoluze Marketing)

Gerador de assinaturas de e-mail com **entregas guardadas em base de dados** (Supabase).
Recriação do gerador HTML original, mantendo a assinatura **idêntica**, mas resolvendo
o problema das entregas que se perdiam: antes ficavam no `localStorage` do navegador
(desapareciam ao trocar de computador, navegador ou limpar o cache). Agora ficam no banco.

## Páginas

| Página | Ficheiro | Para quem | O que faz |
|---|---|---|---|
| **Gerador** | `index.html` | Uso interno (Evoluze) | Cria/edita assinaturas e grava as entregas no banco. |
| **Cliente** | `entregas.html` | Link enviado ao cliente | Lê do banco e mostra todas as assinaturas + controlo de entrega, com botão de copiar. Só leitura. |

O link do cliente é **fixo** e atualiza automaticamente: tudo o que é guardado no gerador
aparece nele. Nada se perde.

## Estrutura

```
index.html            Gerador (interno)
entregas.html         Página do cliente (pública, só leitura)
assets/
  logo.js             Logótipo oficial em base64
  sig-core.js         Núcleo de renderização (montar/dim) — saída idêntica ao original
  db.js               Camada de dados (Supabase): config + entregas
  supabase.js         @supabase/supabase-js v2 (vendorizado, sem CDN externo)
netlify.toml          Configuração de hospedagem estática
```

## Base de dados (Supabase)

- `ig_config` — linha única com as definições fixas (logo, site, escala, empresa, rodapé).
- `ig_assinaturas` — uma linha por assinatura (código `IG-000`, nome, cargo, e-mail, telefone, data).
- `ig_guardar_pessoa(...)` — função que gera o código sequencial de forma atómica e faz
  upsert por e-mail (mesma lógica do gerador original, mas à prova de concorrência).

As chaves usadas nas páginas são a **URL do projeto** e a **chave anónima (pública)** do
Supabase — próprias para uso no navegador, protegidas por Row Level Security.

## Desenvolvimento local

```bash
python3 -m http.server 8099
# abrir http://localhost:8099/index.html  e  /entregas.html
```
