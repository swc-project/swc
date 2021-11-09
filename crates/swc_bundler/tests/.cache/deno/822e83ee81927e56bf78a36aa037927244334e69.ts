// Loaded from https://deno.land/x/dnit@dnit-v1.11.0/launch.ts


/// Convenience util to launch a user's dnit.ts

import { log, fs, path, semver } from "./deps.ts";

type UserSource = {
  baseDir: string;
  dnitDir: string;
  mainSrc: string;
  importmap: string | null;
};

type FindUserSourceContext = {
  stat: Deno.FileInfo;
  path: string;
};

function findUserSourceContext(dir: string): FindUserSourceContext {
  const pathParts = dir.split(path.SEP);
  return {
    path: dir,
    stat: Deno.lstatSync(dir),
  };
}

function findUserSource(
  dir: string,
  startCtxArg: FindUserSourceContext | null,
): UserSource | null {
  const startCtx = (startCtxArg === null)
    ? findUserSourceContext(dir)
    : startCtxArg;
  const dirStat = Deno.lstatSync(dir);

  /// Do not cross filesystems (this is how git stops looking for a git dir)
  if (dirStat.dev !== startCtx.stat.dev) {
    return null;
  }

  /// Abort at root:
  if (path.resolve(path.join(dir, "..")) === dir) {
    return null;
  }

  const subdirs = [
    "dnit", // subdirectory (preferred so that subdir is a deno only typescript tree)
  ];

  const defaultSources = [
    "main.ts",
    "dnit.ts",
  ];

  const importmaps = [
    "import_map.json",
    ".import_map.json", // optionally hidden file
  ];

  for (const subdir of subdirs) {
    for (const sourceName of defaultSources) {
      const res = {
        baseDir: path.resolve(dir),
        dnitDir: path.resolve(path.join(dir, subdir)),
        mainSrc: path.resolve(path.join(dir, subdir, sourceName)),
      };

      if (fs.existsSync(res.mainSrc)) {
        for (const importMapFile of importmaps) {
          const importmap = path.resolve(path.join(dir, subdir, importMapFile));
          if (fs.existsSync(importmap)) {
            return {
              ...res,
              importmap,
            };
          }
        }

        return {
          ...res,
          importmap: null,
        };
      }
    }
  }

  // recurse to parent directory to find dnit script
  return findUserSource(path.join(dir, ".."), startCtx);
}

export async function parseDotDenoVersionFile(fname: string) : Promise<string> {
  const denoReqSemverRange = await Deno.readTextFile(fname);
  return denoReqSemverRange;
}

export async function getDenoVersion() : Promise<string> {
  const proc = Deno.run({
    cmd: ["deno", "--version"],
    stdout: 'piped'
  });
  const [status, output] = await Promise.all([proc.status(), proc.output()]);
  const decoder = new TextDecoder();
  const denoVersionStr = decoder.decode(output);

  const regmatch = denoVersionStr.match(/deno[ ]+([0-9.]+)/);
  if(regmatch) {
    return regmatch[1];
  }
  throw new Error("Invalid parse of deno version output");
}

export function checkValidDenoVersion(denoVersion: string, denoReqSemverRange: string) : boolean {
  return semver.satisfies(denoVersion, denoReqSemverRange);
}

export async function launch(logger: log.Logger): Promise<Deno.ProcessStatus> {
  const userSource = findUserSource(Deno.cwd(), null);
  if (userSource !== null) {
    logger.info("running source:" + userSource.mainSrc);
    logger.info("running wd:" + userSource.baseDir);
    logger.info("running importmap:" + userSource.importmap);
    logger.info("running dnitDir:" + userSource.dnitDir);

    const denoVersion = await getDenoVersion();
    logger.info("deno version:" + denoVersion);

    const dotDenoVersionFile = path.join(userSource.dnitDir, '.denoversion');
    if (fs.existsSync(dotDenoVersionFile)) {
      const reqDenoVerStr = await parseDotDenoVersionFile(dotDenoVersionFile);
      const validDenoVer = checkValidDenoVersion(denoVersion, reqDenoVerStr);
      if (!validDenoVer) {
        throw new Error("Requires deno version " + reqDenoVerStr);
      }
      logger.info("deno version ok:" + denoVersion + " for " + reqDenoVerStr);
    }

    Deno.chdir(userSource.baseDir);

    const permissions = [
      "--allow-read",
      "--allow-write",
      "--allow-run",
      "--allow-env",
      "--allow-net",
    ];
    const flags = [
      "--quiet",
      "--unstable",
    ];
    const importmap = userSource.importmap
      ? [
        "--importmap",
        userSource.importmap,
      ]
      : [];

    const proc = Deno.run({
      cmd: ["deno", "run"]
        .concat(flags)
        .concat(permissions)
        .concat(importmap)
        .concat([userSource.mainSrc])
        .concat(["--dnitDir", userSource.dnitDir])
        .concat(Deno.args),
    });

    const status = await proc.status();
    return status;
  } else {
    logger.error("No dnit.ts or dnit directory found");
    return {
      success: false,
      code: 1,
    };
  }
}
