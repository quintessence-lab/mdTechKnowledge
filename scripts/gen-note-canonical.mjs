// handoff-files.md から { slug: note_url } マップを生成し src/data/note-urls.json に書き出す。
//
// canonical 用途: note公開済み(note: ON)の記事は、GitHub Pages版の <link rel="canonical"> を
// note URL に向ける（note=本体方針）。note未公開の記事はマップに載らず、自URLが正規のままになる。
//
// 使い方:  node scripts/gen-note-canonical.mjs
// 既定の handoff パス: ../mdtechknowledge-handoff/handoff-files.md（環境変数 HANDOFF_MD で上書き可）
//
// frontmatter は一切触らない（rev/STALE 管理に影響させない）。本スクリプトは読み取り専用で参照する。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const HANDOFF_MD =
  process.env.HANDOFF_MD ||
  resolve(ROOT, '..', 'mdtechknowledge-handoff', 'handoff-files.md');
const OUT = resolve(ROOT, 'src', 'data', 'note-urls.json');

function main() {
  let text;
  try {
    text = readFileSync(HANDOFF_MD, 'utf-8');
  } catch (e) {
    console.error(`[gen-note-canonical] handoff-files.md を読めません: ${HANDOFF_MD}`);
    console.error('  → 空マップを書き出して継続します（全記事が自URL正規になります）。');
    writeOut({});
    return;
  }

  // "### " 区切りでエントリ分割し、各エントリから「取り込み先(.md)」と「note: ON | URL」を対応づける
  const entries = text.split(/\n### /);
  const map = {};
  let count = 0;
  for (const e of entries) {
    const mf = e.match(/取り込み先\*\*:\s*`([^`]+)\.md`/);
    const mn = e.match(/<!--\s*note:\s*ON\s*\|\s*(https:\/\/note\.com\/\S+?)\s*\|/);
    if (mf && mn) {
      map[mf[1]] = mn[1];
      count++;
    }
  }
  writeOut(map);
  console.log(`[gen-note-canonical] ${count} 件の slug→note_url を ${OUT} に書き出しました。`);
}

function writeOut(map) {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(map, null, 2) + '\n', 'utf-8');
}

main();
