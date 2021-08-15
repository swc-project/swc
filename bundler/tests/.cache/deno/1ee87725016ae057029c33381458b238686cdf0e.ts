// Loaded from https://deno.land/x/compress@v0.3.8/tar/mod.ts


import { Tar, Untar, ensureDir, path } from "../deps.ts";
import type { compressInterface } from "../interface.ts";

export async function uncompress(src: string, dest: string): Promise<void> {
  const reader = await Deno.open(src, { read: true });
  const untar = new Untar(reader);
  for await (const entry of untar) {
    const filePath = path.resolve(dest, entry.fileName);
    if (entry.type === "directory") {
      await ensureDir(filePath);
      continue;
    }
    await ensureDir(path.dirname(filePath));
    const file = await Deno.open(filePath, { write: true, create: true });
    await Deno.copy(entry, file);
    await file.close();
  }
  reader.close();
}

export async function compress(
  src: string,
  dest: string,
  options?: compressInterface,
): Promise<void> {
  const tar = new Tar();
  const stat = await Deno.lstat(src);
  if (stat.isFile) {
    await tar.append(path.basename(src), {
      filePath: src,
      contentSize: stat.size,
      mtime: (stat?.mtime ?? new Date()).valueOf() / 1000,
    });
  } else {
    const appendFolder = async (folder: string, prefix?: string) => {
      for await (const entry of Deno.readDir(folder)) {
        const { isDirectory, name } = entry;
        const fileName = prefix ? `${prefix}/${name}` : name;
        const filePath = path.resolve(folder, name);
        const stat = await Deno.stat(filePath);
        if (isDirectory) {
          await tar.append(
            `${fileName}/`,
            {
              reader: new Deno.Buffer(),
              contentSize: 0,
              type: "directory",
              mtime: (stat?.mtime ?? new Date()).valueOf() / 1000,
            },
          );
          await appendFolder(filePath, fileName);
        } else {
          await tar.append(fileName, {
            filePath,
            mtime: (stat?.mtime ?? new Date()).valueOf() / 1000,
            contentSize: stat.size,
          });
        }
      }
    };
    if (options?.excludeSrc) {
      await appendFolder(src);
    } else {
      const folderName = path.basename(src);
      await tar.append(
        `${folderName}/`,
        {
          filePath: src,
          // type: "directory",
          // mtime: (stat?.mtime ?? new Date()).valueOf() / 1000,
          // contentSize: 0,
          // reader: new Deno.Buffer(),
        },
      );
      await appendFolder(src, folderName);
    }
  }
  const writer = await Deno.open(dest, { write: true, create: true });
  await Deno.copy(tar.getReader(), writer);
  writer.close();
}
