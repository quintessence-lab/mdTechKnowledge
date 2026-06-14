// scripts/sync-zenn.mjs
//
// zenn-selection.json で「選択した記事」だけを Zenn 形式に変換し articles/ に出力する。
// - 選択した記事は全文掲載（表は markdown のまま＝Zenn がそのままレンダリング）
// - Astro frontmatter → Zenn frontmatter（title/emoji/type/topics/published, 任意で canonical_url）
// - 内部ブログリンクは note 公開済みなら note URL へ、未公開なら GitHub Pages へ（絶対URL化）
// - 画像 /images/... は GitHub Pages の絶対URLへ
// - iframe は除去し警告（本文が iframe 主体の記事は Zenn 向きでない）
// - 末尾に「全記事は note で」CTA を付与
//
// 使い方:  node scripts/sync-zenn.mjs   （または npm run zenn-sync）
// 選択の編集:  リポジトリ直下の zenn-selection.json を編集する

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BLOG_DIR = resolve(ROOT, 'src', 'content', 'blog');
const ARTICLES_DIR = resolve(ROOT, 'articles');
const SELECTION = resolve(ROOT, 'zenn-selection.json');
const NOTE_URLS = resolve(ROOT, 'src', 'data', 'note-urls.json');

const SITE = 'https://quintessence-lab.github.io/mdTechKnowledge';
const NOTE_CREATOR = 'https://note.com/mdtechknowledge';

function loadJSON(p, fallback) {
  try { return JSON.parse(readFileSync(p, 'utf-8')); } catch { return fallback; }
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: raw };
  const fmText = m[1], body = m[2];
  const tm = fmText.match(/^title:\s*"((?:[^"\\]|\\.)*)"/m);
  const title = tm ? tm[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\') : '';
  let tags = [];
  const tagsLine = fmText.match(/^tags:\s*\[(.*)\]\s*$/m)?.[1];
  if (tagsLine) tags = [...tagsLine.matchAll(/"([^"]*)"/g)].map((x) => x[1]);
  return { fm: { title, tags }, body };
}

// コードブロックを保護してリンク・画像を絶対URL化
function transformLinks(body, noteMap) {
  const parts = body.split(/(```[\s\S]*?```)/g);
  const conv = (seg) => {
    let s = seg;
    // 内部ブログリンク: /blog/SLUG/ または /mdTechKnowledge/blog/SLUG/（#anchor 可）
    s = s.replace(/\]\(\/(?:mdTechKnowledge\/)?blog\/([a-z0-9-]+)\/?(#[^)]*)?\)/g,
      (_, slug, anchor) => {
        const dest = noteMap[slug] || `${SITE}/blog/${slug}/`;
        return `](${dest}${anchor || ''})`;
      });
    // 画像: /images/... または /mdTechKnowledge/images/...
    s = s.replace(/\]\(\/(?:mdTechKnowledge\/)?images\/([^)]+)\)/g,
      (_, p) => `](${SITE}/images/${p})`);
    // 残りの /mdTechKnowledge/... ルート相対
    s = s.replace(/\]\(\/mdTechKnowledge\/([^)]+)\)/g, (_, p) => `](${SITE}/${p})`);
    // 残りの /xxx ルート相対（//... は除外）
    s = s.replace(/\]\(\/(?!\/)([^)]+)\)/g, (_, p) => `](${SITE}/${p})`);
    return s;
  };
  return parts.map((p, i) => (i % 2 === 1 ? p : conv(p))).join('');
}

function sanitizeTopics(topics) {
  return (topics || []).map((t) => String(t).trim()).filter(Boolean).slice(0, 5);
}

function buildZenn(entry, noteMap) {
  const raw = readFileSync(resolve(BLOG_DIR, `${entry.slug}.md`), 'utf-8');
  const { fm, body } = parseFrontmatter(raw);
  const title = entry.title || fm.title;
  if (title.length > 70) {
    console.error(`  ⚠ [${entry.slug}] タイトル ${title.length} 字（Zenn上限70超過）— zenn-selection.json の "title" で短縮してください`);
  }
  const emoji = entry.emoji || '📝';
  const type = entry.type || 'tech';
  const topics = sanitizeTopics(entry.topics && entry.topics.length ? entry.topics : fm.tags);
  const canonical = noteMap[entry.slug] || null;
  const hasIframe = /<iframe\b/i.test(body);

  let out = transformLinks(body, noteMap);
  out = out.replace(/<iframe[\s\S]*?<\/iframe>/gi, '').replace(/<iframe\b[^>]*\/?>/gi, '');
  out = out.trim();

  const fmLines = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `emoji: "${emoji}"`,
    `type: "${type}"`,
    `topics: [${topics.map((t) => JSON.stringify(t)).join(', ')}]`,
    'published: true',
  ];
  if (canonical) fmLines.push(`canonical_url: "${canonical}"`);
  fmLines.push('---');

  const cta = [
    '', '---', '',
    ':::message',
    'この記事は技術解説サイト **mdTechKnowledge** の一篇です。技術系に加えて哲学・IPO など幅広いテーマの**全記事は note でまとめて公開**しています。',
    `全投稿はこちら → ${NOTE_CREATOR}`,
    ':::', '',
  ].join('\n');

  return { text: fmLines.join('\n') + '\n\n' + out + '\n' + cta, canonical, hasIframe };
}

function main() {
  const sel = loadJSON(SELECTION, { articles: [] });
  const noteMap = loadJSON(NOTE_URLS, {});
  mkdirSync(ARTICLES_DIR, { recursive: true });
  const selected = new Set();
  let n = 0;
  for (const entry of sel.articles || []) {
    if (!entry.slug) continue;
    try {
      const { text, canonical, hasIframe } = buildZenn(entry, noteMap);
      writeFileSync(resolve(ARTICLES_DIR, `${entry.slug}.md`), text, 'utf-8');
      selected.add(`${entry.slug}.md`);
      console.log(`  ✓ ${entry.slug}.md${canonical ? ' (canonical→note)' : ' (canonicalなし)'}${hasIframe ? '  ⚠ iframeを除去（本文がiframe主体なら要確認）' : ''}`);
      n++;
    } catch (e) {
      console.error(`  ✗ ${entry.slug}: ${e.message}`);
    }
  }
  const existing = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md');
  const orphans = existing.filter((f) => !selected.has(f));
  if (orphans.length) {
    console.log(`  ! 選択外の articles/ ファイル（zenn-selection.json に無い）: ${orphans.join(', ')}`);
    console.log('    → Zenn 非公開にするには各ファイルの published を false にするか、ファイルを削除してください。');
  }
  console.log(`[sync-zenn] ${n} 件を articles/ に生成しました。`);
}

main();
