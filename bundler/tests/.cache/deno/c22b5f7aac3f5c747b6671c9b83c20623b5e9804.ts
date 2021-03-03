// Loaded from https://deno.land/x/sqlite@v2.3.1/build/vfs.js


import { getStr } from "../src/wasm.ts";

// Closure to return an environment that links
// the current wasm context
export default function env(inst) {
  // Map file rids to file names, since
  // some of Deno's os methods use files-names
  // instead of resource ids.
  const files = new Map();

  // Exported environment
  const env = {
    // Print a string pointer to console
    js_print: (str_ptr) => {
      const text = getStr(inst.exports, str_ptr);
      console.log(text[text.length - 1] === "\n" ? text.slice(0, -1) : text);
    },
    // Open the file at path, mode = 0 is open RW, mode = 1 is open TEMP
    js_open: (path_ptr, mode) => {
      let path;
      switch (mode) {
        case 0:
          path = getStr(inst.exports, path_ptr);
          break;
        case 1:
          path = Deno.makeTempFileSync({ prefix: "deno_sqlite" });
          break;
      }
      let rid =
        Deno.openSync(path, { read: true, write: true, create: true }).rid;
      files.set(rid, path);
      return rid;
    },
    // Close a file
    js_close: (rid) => {
      Deno.close(rid);
      files.delete(rid);
    },
    // Delete file at path
    js_delete: (path_ptr) => {
      let path = getStr(inst.exports, path_ptr);
      Deno.removeSync(path);
    },
    // Read from a file to a buffer in the module
    js_read: (rid, buffer_ptr, offset, amount) => {
      const buffer = new Uint8Array(
        inst.exports.memory.buffer,
        buffer_ptr,
        amount,
      );
      Deno.seekSync(rid, offset, Deno.SeekMode.Start);
      return Deno.readSync(rid, buffer);
    },
    // Write to a file from a buffer in the module
    js_write: (rid, buffer_ptr, offset, amount) => {
      const buffer = new Uint8Array(
        inst.exports.memory.buffer,
        buffer_ptr,
        amount,
      );
      Deno.seekSync(rid, offset, Deno.SeekMode.Start);
      return Deno.writeSync(rid, buffer);
    },
    // Truncate the given file
    js_truncate: (rid, size) => {
      Deno.truncateSync(files.get(rid), size);
    },
    // Retrieve the size of the given file
    js_size: (rid) => {
      return Deno.statSync(files.get(rid)).size;
    },
    // Return current time in ms since UNIX epoch
    js_time: () => {
      return Date.now();
    },
    // Determine if a path exists
    js_exists: (path_ptr) => {
      const path = getStr(inst.exports, path_ptr);
      try {
        Deno.statSync(path);
      } catch (e) {
        if (e instanceof Deno.errors.NotFound) {
          return 0;
        }
      }
      return 1;
    },
    // Determine if a path is accessible i.e. if it has read/write permissions
    // TODO(dyedgreen): Properly determine if there are read permissions
    js_access: (path_ptr) => {
      const path = getStr(inst.exports, path_ptr);
      try {
        Deno.statSync(path);
      } catch (e) {
        if (e instanceof Deno.errors.PermissionDenied) {
          return 0;
        }
      }
      return 1;
    },
  };

  return { env };
}
