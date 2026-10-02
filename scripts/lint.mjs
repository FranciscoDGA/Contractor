import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const ROOT = process.cwd();
const errors = [];
const warnings = [];

const BANNED = [
  { name: 'guaranteed (outcome claim)', re: /\bguaranteed\b/i },
  { name: 'airtight/bulletproof/watertight', re: /\bairtight\b|\bbulletproof\b|\bwater-?tight\b/i },
  { name: 'unsourced superlative (#1/most trusted/best contractor)', re: /#1\b|\bmost trusted\b|\bbest contractor(s)?\b/i },
  { name: 'advice-style legal phrasing', re: /\byou should (file|sue|sign|report|evict)\b/i },
  { name: 'guarantee about the site itself', re: /\bwe (guarantee|promise)\b/i },
  { name: 'fake statistic marker', re: /\b29% regret\b|\bsecond-leading\b/i }
];

const ALLOW = ['do not guarantee', 'does not guarantee', 'no guarantee', 'not a guarantee', 'without any guarantee'];

function walk(dir, exts, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, exts, out);
    else if (exts.includes(extname(entry).toLowerCase())) out.push(full);
  }
  return out;
}

const contentFiles = walk(join(ROOT, 'src', 'content'), ['.md', '.mdx']);
for (const file of contentFiles) {
  const text = readFileSync(file, 'utf8');
  if (!/^##\s+Sources\b/mi.test(text)) {
    errors.push(`${relative(ROOT, file)}: missing "## Sources" section`);
  }
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) {
    errors.push(`${relative(ROOT, file)}: missing frontmatter block`);
    continue;
  }
  for (const key of ['title:', 'description:', 'keyword:', 'cluster:', 'published:', 'updated:']) {
    if (!fm[1].includes(key)) errors.push(`${relative(ROOT, file)}: frontmatter missing "${key}"`);
  }
}

const distDir = join(ROOT, 'dist');
if (!existsSync(distDir)) {
  console.error('lint: dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const htmlFiles = walk(distDir, ['.html']);
for (const file of htmlFiles) {
  const raw = readFileSync(file, 'utf8');
  const text = raw
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ');
  for (const rule of BANNED) {
    const matches = text.match(new RegExp(rule.re.source, rule.re.flags + 'g')) || [];
    if (matches.length === 0) continue;
    const offending = matches.filter((m) => {
      const idx = text.indexOf(m);
      const window = text.slice(Math.max(0, idx - 60), idx + 60).toLowerCase();
      return !ALLOW.some((a) => window.includes(a));
    });
    if (offending.length > 0) {
      errors.push(`${relative(distDir, file)}: banned claim "${rule.name}" → "${offending[0]}"`);
    }
  }
}

if (warnings.length) console.log(warnings.join('\n'));
if (errors.length) {
  console.error(`\nlint: ${errors.length} problem(s)\n`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
console.log(`lint: OK — ${contentFiles.length} guides, ${htmlFiles.length} pages clean.`);
