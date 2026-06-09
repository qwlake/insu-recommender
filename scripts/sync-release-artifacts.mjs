import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const sourceDir = join(root, 'output', 'submission');
const releaseDir = join(root, 'release-artifacts');
const files = [
  'hanwha-ai-insurance-recommender-submission.html',
  'hanwha-ai-insurance-recommender-submission.pdf',
];

mkdirSync(releaseDir, { recursive: true });

for (const file of files) {
  const source = join(sourceDir, file);
  const target = join(releaseDir, basename(file));

  if (!existsSync(source)) {
    throw new Error(`Missing release source: ${source}`);
  }

  copyFileSync(source, target);
  const size = statSync(target).size;
  console.log(`copied ${file} -> release-artifacts/ (${size} bytes)`);
}
