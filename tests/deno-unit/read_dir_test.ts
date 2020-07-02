// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import {
  unitTest,
  assert,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
  pathToAbsoluteFileUrl,
} from "./test_util.ts";

function assertSameContent(files: Deno.DirEntry[]): void {
  let counter = 0;

  for (const entry of files) {
    if (entry.name === "subdir") {
      assert(entry.isDirectory);
      counter++;
    }
  }

  assertEquals(counter, 1);
}

unitTest({ perms: { read: true } }, function readDirSyncSuccess(): void {
  const files = [...Deno.readDirSync("cli/tests/")];
  assertSameContent(files);
});

unitTest({ perms: { read: true } }, function readDirSyncWithUrl(): void {
  const files = [...Deno.readDirSync(pathToAbsoluteFileUrl("cli/tests"))];
  assertSameContent(files);
});

unitTest({ perms: { read: false } }, function readDirSyncPerm(): void {
  assertThrows(() => {
    Deno.readDirSync("tests/");
  }, Deno.errors.PermissionDenied);
});

unitTest({ perms: { read: true } }, function readDirSyncNotDir(): void {
  assertThrows(() => {
    Deno.readDirSync("cli/tests/fixture.json");
  }, Error);
});

unitTest({ perms: { read: true } }, function readDirSyncNotFound(): void {
  assertThrows(() => {
    Deno.readDirSync("bad_dir_name");
  }, Deno.errors.NotFound);
});

unitTest({ perms: { read: true } }, async function readDirSuccess(): Promise<
  void
> {
  const files = [];
  for await (const dirEntry of Deno.readDir("cli/tests/")) {
    files.push(dirEntry);
  }
  assertSameContent(files);
});

unitTest({ perms: { read: true } }, async function readDirWithUrl(): Promise<
  void
> {
  const files = [];
  for await (const dirEntry of Deno.readDir(
    pathToAbsoluteFileUrl("cli/tests")
  )) {
    files.push(dirEntry);
  }
  assertSameContent(files);
});

unitTest({ perms: { read: false } }, async function readDirPerm(): Promise<
  void
> {
  await assertThrowsAsync(async () => {
    await Deno.readDir("tests/")[Symbol.asyncIterator]().next();
  }, Deno.errors.PermissionDenied);
});
