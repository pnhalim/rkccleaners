import { cp, lstat, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

async function validateBuild(directory) {
  for (const name of await readdir(directory)) {
    if (name.startsWith('.') || name === 'previews') {
      throw new Error(`Reserved build path: ${name}`);
    }
    const path = join(directory, name);
    const stat = await lstat(path);
    if (stat.isDirectory()) await validateBuild(path);
    else if (!stat.isFile()) throw new Error(`Unsupported build path: ${path}`);
  }
}

export async function composePages(
  snapshot,
  build,
  number = '',
  mode = 'update',
) {
  if (number && !/^[1-9]\d*$/.test(number))
    throw new Error('Invalid PR number');
  if (!['update', 'remove'].includes(mode) || (mode === 'remove' && !number)) {
    throw new Error('Invalid publishing mode');
  }
  if (mode === 'update') {
    await validateBuild(build);
    if (!(await lstat(join(build, 'index.html'))).isFile()) {
      throw new Error('Build is missing index.html');
    }
  }
  const destination = number
    ? join(snapshot, 'previews', `pr-${number}`)
    : snapshot;
  if (number) {
    await rm(destination, { recursive: true, force: true });
  } else {
    for (const name of await readdir(snapshot)) {
      if (!['.git', 'previews'].includes(name)) {
        await rm(join(snapshot, name), { recursive: true, force: true });
      }
    }
  }
  if (mode === 'update') {
    await cp(build, destination, { recursive: true });
    if (number) {
      const html = await readFile(join(destination, 'index.html'), 'utf8');
      await writeFile(
        join(destination, 'index.html'),
        html.replace('<head>', '<head><meta name="robots" content="noindex">'),
      );
    }
  }
  await writeFile(join(snapshot, '.nojekyll'), '');
}

if (import.meta.url === pathToFileURL(resolve(process.argv[1] || '')).href) {
  await composePages(
    ...process.argv.slice(2, 4).map((path) => resolve(path)),
    process.env.PR_NUMBER || '',
    process.env.PUBLISH_MODE || 'update',
  );
}
