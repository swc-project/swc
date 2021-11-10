// Loaded from https://deno.land/x/jszip/mod.ts


import  _JSZip from "https://dev.jspm.io/jszip@3.5.0";
import { WalkOptions, walk } from "https://deno.land/std@0.85.0/fs/mod.ts";
import { SEP, join } from "https://deno.land/std@0.85.0/path/mod.ts";
import type {
  InputFileFormat,
  JSZipFileOptions,
  JSZipGeneratorOptions,
  JSZipLoadOptions,
  JSZipObject,
  OutputByType,
} from "./types.ts";

/**
 * Read zip file asynchronously from a file
 *
 * @param path of zip file
 * @return Returns promise
 */
export async function readZip(path: string): Promise<JSZip> {
  const z = new JSZip();
  const content: Uint8Array = await Deno.readFile(path);
  await z.loadAsync(content);
  return z;
}

/**
 * Read a directory as a JSZip
 *
 * @param dir directory
 * @return Returns promise
 */
export async function zipDir(
  dir: string,
  options?: WalkOptions,
): Promise<JSZip> {
  const z = new JSZip();
  const cwd = Deno.cwd();
  // FIXME it would be nice to do this without chdir...
  Deno.chdir(dir);
  try {
    for await (const f of walk(".", options)) {
      if (f.isDirectory) {
        // skip directories
        continue;
      }
      const contents = await Deno.readFile(f.path);

      // In order to support Windows we do this ridiculousness.
      let ff = f.path.split(SEP);
      let zz = z;
      while (ff.length > 1) {
        zz = zz.folder(ff.shift()!);
      }
      zz.addFile(ff[0], contents);
    }
  } finally {
    Deno.chdir(cwd);
  }
  return z;
}

export class JSZip {
  protected _z: any;

  // we should assert the type (we want it to be a _JSZip) ?
  constructor(z?: any) {
    if (z === undefined) {
      // @ts-ignores
      this._z = new _JSZip();
    } else {
      this._z = z;
    }
  }

  /**
   * Returns an new JSZip instance with the given folder as root
   *
   * @param name Name of the folder
   * @return New JSZip object with the given folder as root or null
   */
  folder(name: string): JSZip {
    // @ts-ignores
    const f = this._z.folder(name);
    return new JSZip(f);
  }

  /**
   * Get a file from the archive
   *
   * @param Path relative path to file
   * @return File matching path, null if no file found
   */
  file(path: string): JSZipObject {
    // @ts-ignores
    const f = this._z.file(path);
    return f as JSZipObject;
  }

  /**
   * Add a file to the archive
   *
   * @param path Relative path to file
   * @param data Content of the file
   * @param options Optional information about the file
   * @return JSZip object
   */
  addFile(
    path: string,
    content?: string | Uint8Array,
    options?: JSZipFileOptions,
  ): JSZipObject {
    // @ts-ignores
    const f = this._z.file(path, content, options);
    return f as JSZipObject;
  }

  files(): { [key: string]: JSZipObject } {
    // @ts-ignores
    const fs = this._z.files;
    return fs;
  }

  /**
   * Generates a new archive asynchronously
   *
   * @param options Optional options for the generator
   * @param onUpdate The optional function called on each internal update with the metadata.
   * @return The serialized archive
   */
  async generateAsync<T extends keyof OutputByType>(
    options?: JSZipGeneratorOptions<T>,
  ): Promise<OutputByType[T]> {
    // @ts-ignores
    return await this._z.generateAsync(options);
  }

  /**
   * Get all files which match the given filter function
   *
   * @param predicate Filter function
   * @return Array of matched elements
   */
  filter(
    predicate: (relativePath: string, file: JSZipObject) => boolean,
  ): JSZipObject[] {
    // @ts-ignores
    return this._z.filter(predicate);
  }

  /**
   * Removes the file or folder from the archive
   *
   * @param path Relative path of file or folder
   * @return Returns the JSZip instance
   */
  remove(path: string): JSZip {
    // @ts-ignores
    return this._z.remove(path);
  }

  /**
   * Load zip data
   *
   * @param data Serialized zip file
   * @param options Options for deserializing
   * @return Returns promise of self
   */
  async loadAsync(
    data: InputFileFormat,
    options?: JSZipLoadOptions,
  ): Promise<JSZip> {
    await this._z.loadAsync(data, options);
    return this;
  }

  /**
   * Write zip file asynchronously to a file
   *
   * @param path of zip file
   * @return Returns promise
   */
  async writeZip(path: string): Promise<void> {
    const b: Uint8Array = await this.generateAsync({ type: "uint8array" });
    return await Deno.writeFile(path, b);
  }

  /**
   * Unzip a JSZip asynchronously to a directory
   *
   * @param dir to unzip into
   * @return Returns promise
   */
  async unzip(dir: string = "."): Promise<void> {
    // FIXME optionally replace the existing folder prefix with dir.
    for (const f of this) {
      const ff = join(dir, f.name);
      if (f.dir) {
        // hopefully the directory is prior to any files inside it!
        await Deno.mkdir(ff, { recursive: true });
        continue;
      }
      const content = await f.async("uint8array");
      // TODO pass WriteFileOptions e.g. mode
      await Deno.writeFile(ff, content);
    }
  }

  *[Symbol.iterator](): Iterator<JSZipObject> {
    yield* Object.values(this.files());
  }
}
