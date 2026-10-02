import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  symlink,
  rm,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { composePages } from '../../scripts/compose-pages.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'pages-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const snapshot = join(root, 'published');
  const build = join(root, 'build');
  await mkdir(join(snapshot, '.git'), { recursive: true });
  await mkdir(build);
  await writeFile(join(snapshot, 'index.html'), 'production');
  await writeFile(join(snapshot, 'old.css'), 'old');
  await writeFile(join(snapshot, '.git', 'config'), 'git metadata');
  await writeFile(join(build, 'index.html'), '<head></head>new site');
  return { snapshot, build };
}

test('preview updates and cleanup preserve production and other previews', async (t) => {
  const { snapshot, build } = await fixture(t);
  await composePages(snapshot, build, '3');
  await composePages(snapshot, build, '4');
  await writeFile(join(snapshot, 'previews', 'pr-4', 'old.css'), 'stale');
  await composePages(snapshot, build, '4');
  await assert.rejects(readFile(join(snapshot, 'previews', 'pr-4', 'old.css')));
  await composePages(snapshot, build, '4', 'remove');
  assert.equal(
    await readFile(join(snapshot, 'index.html'), 'utf8'),
    'production',
  );
  assert.equal(
    await readFile(join(snapshot, 'previews', 'pr-3', 'index.html'), 'utf8'),
    '<head><meta name="robots" content="noindex"></head>new site',
  );
  await assert.rejects(
    readFile(join(snapshot, 'previews', 'pr-4', 'index.html')),
  );
});

test('production updates preserve previews and git metadata, removing stale files', async (t) => {
  const { snapshot, build } = await fixture(t);
  await composePages(snapshot, build, '3');
  await composePages(snapshot, build);
  assert.equal(
    await readFile(join(snapshot, 'index.html'), 'utf8'),
    '<head></head>new site',
  );
  assert.equal(
    await readFile(join(snapshot, 'previews', 'pr-3', 'index.html'), 'utf8'),
    '<head><meta name="robots" content="noindex"></head>new site',
  );
  assert.equal(
    await readFile(join(snapshot, '.git', 'config'), 'utf8'),
    'git metadata',
  );
  await assert.rejects(readFile(join(snapshot, 'old.css')));
});

test('reject invalid identifiers, reserved paths, and symlinks before changing a snapshot', async (t) => {
  const { snapshot, build } = await fixture(t);
  await assert.rejects(composePages(snapshot, build, '../main'));
  await mkdir(join(build, '.git'));
  await assert.rejects(composePages(snapshot, build, '4'), /Reserved/);
  await rm(join(build, '.git'), { recursive: true });
  await mkdir(join(build, 'previews'));
  await assert.rejects(composePages(snapshot, build), /Reserved/);
  await rm(join(build, 'previews'), { recursive: true });
  await symlink(join(snapshot, 'index.html'), join(build, 'leak.html'));
  await assert.rejects(composePages(snapshot, build, '4'), /Unsupported/);
  assert.equal(
    await readFile(join(snapshot, 'index.html'), 'utf8'),
    'production',
  );
});
