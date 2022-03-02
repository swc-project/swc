#!/usr/bin/env node

/**
 * Lightweight entrypoint to native swc cli binary.
 *
 * This is to locate corresponding per-platform executables correctly, as well as
 * let npm links binary to `node_modules/.bin` allows npm-related ecosystem (`npx swcx`, etcs)
 * works correctly. However, it means spawning native binary still requires warmup from node.js
 * process.
 *
 * NOTE: THIS IS NOT A PERMANENT APPROACH.
 * Distribution of native cli binary is not fully concluded yet. This allows easier
 * opt-in while implementation is in progress to collect feedback.
 */
import { spawn, StdioOptions } from "child_process";
import path from "path";
import { readFileSync } from "fs";

const { platform, arch } = process;

const isMusl = () => (() => {
  function isMusl() {
    if (!process.report || typeof process.report.getReport !== "function") {
      try {
        return readFileSync("/usr/bin/ldd", "utf8").includes("musl");
      } catch (e) {
        return true;
      }
    } else {
      const { glibcVersionRuntime } = (process.report.getReport() as any).header;
      return !glibcVersionRuntime;
    }
  }

  return isMusl();
})();


const platformPackagesMap: Record<string, Partial<Record<string, string>>> = {
  "android": {
    "arm64": "@swc/core-android-arm64",
    "arm": "@swc/core-android-arm-eabi",
  },
  "win32": {
    "x64": "@swc/core-win32-x64-msvc",
    "ia32": "@swc/core-win32-ia32-msvc",
    "arm64": "@swc/core-win32-arm64-msvc"
  },
  "darwin": {
    "x64": "@swc/core-darwin-x64",
    "arm64": "@swc/core-darwin-arm64",
  },
  "freebsd": {
    "x64": "@swc/core-freebsd-x64",
  },
  "linux": {
    "x64": `@swc/core-linux-x64-${isMusl() ? 'musl' : 'gnu'}`,
    "arm64": `@swc/core-linux-arm64-${isMusl() ? 'musl' : 'gnu'}`,
    "arm": "@swc/core-linux-arm64-gnu"
  },
};

const inferBinaryName = () => {
  const packageName = platformPackagesMap[platform][arch];

  if (!packageName) {
    throw new Error(`Unsupported platform: binary for '${platform} ${arch}' is not available`);
  }

  return path.join(path.dirname(require.resolve(packageName)), platform === 'win32' ? 'swc.exe' : 'swc');
}


const executeBinary = async () => {
  const binary = inferBinaryName();
  const [, , ...args] = process.argv;
  const options = { cwd: process.cwd(), stdio: "inherit" as StdioOptions };

  return spawn(binary, args, options);
};

executeBinary().catch((e) => console.error(e));