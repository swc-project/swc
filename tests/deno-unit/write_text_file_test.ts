import {
  unitTest,
  assertEquals,
  assertThrows,
  assertThrowsAsync,
} from "./test_util.ts";

unitTest(
  { perms: { read: true, write: true } },
  function writeTextFileSyncSuccess(): void {
    const filename = Deno.makeTempDirSync() + "/test.txt";
    Deno.writeTextFileSync(filename, "Hello");
    const dataRead = Deno.readTextFileSync(filename);
    assertEquals("Hello", dataRead);
  }
);

unitTest(
  { perms: { read: true, write: true } },
  function writeTextFileSyncByUrl(): void {
    const tempDir = Deno.makeTempDirSync();
    const fileUrl = new URL(
      `file://${Deno.build.os === "windows" ? "/" : ""}${tempDir}/test.txt`
    );
    Deno.writeTextFileSync(fileUrl, "Hello");
    const dataRead = Deno.readTextFileSync(fileUrl);
    assertEquals("Hello", dataRead);

    Deno.removeSync(fileUrl, { recursive: true });
  }
);

unitTest({ perms: { write: true } }, function writeTextFileSyncFail(): void {
  const filename = "/baddir/test.txt";
  // The following should fail because /baddir doesn't exist (hopefully).
  assertThrows(() => {
    Deno.writeTextFileSync(filename, "hello");
  }, Deno.errors.NotFound);
});

unitTest({ perms: { write: false } }, function writeTextFileSyncPerm(): void {
  const filename = "/baddir/test.txt";
  // The following should fail due to no write permission
  assertThrows(() => {
    Deno.writeTextFileSync(filename, "Hello");
  }, Deno.errors.PermissionDenied);
});

unitTest(
  { perms: { read: true, write: true } },
  async function writeTextFileSuccess(): Promise<void> {
    const filename = Deno.makeTempDirSync() + "/test.txt";
    await Deno.writeTextFile(filename, "Hello");
    const dataRead = Deno.readTextFileSync(filename);
    assertEquals("Hello", dataRead);
  }
);

unitTest(
  { perms: { read: true, write: true } },
  async function writeTextFileByUrl(): Promise<void> {
    const tempDir = Deno.makeTempDirSync();
    const fileUrl = new URL(
      `file://${Deno.build.os === "windows" ? "/" : ""}${tempDir}/test.txt`
    );
    await Deno.writeTextFile(fileUrl, "Hello");
    const dataRead = Deno.readTextFileSync(fileUrl);
    assertEquals("Hello", dataRead);

    Deno.removeSync(fileUrl, { recursive: true });
  }
);

unitTest(
  { perms: { read: true, write: true } },
  async function writeTextFileNotFound(): Promise<void> {
    const filename = "/baddir/test.txt";
    // The following should fail because /baddir doesn't exist (hopefully).
    await assertThrowsAsync(async () => {
      await Deno.writeTextFile(filename, "Hello");
    }, Deno.errors.NotFound);
  }
);

unitTest(
  { perms: { write: false } },
  async function writeTextFilePerm(): Promise<void> {
    const filename = "/baddir/test.txt";
    // The following should fail due to no write permission
    await assertThrowsAsync(async () => {
      await Deno.writeTextFile(filename, "Hello");
    }, Deno.errors.PermissionDenied);
  }
);
