// Loaded from https://deno.land/std@0.104.0/_util/os.ts


// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

export const osType = (() => {
  // deno-lint-ignore no-explicit-any
  const { Deno } = globalThis as any;
  if (typeof Deno?.build?.os === "string") {
    return Deno.build.os;
  }

  // deno-lint-ignore no-explicit-any
  const { navigator } = globalThis as any;
  if (navigator?.appVersion?.includes?.("Win") ?? false) {
    return "windows";
  }

  return "linux";
})();

export const isWindows = osType === "windows";
