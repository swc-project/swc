// Loaded from https://deno.land/x/cliffy@v0.18.0/flags/normalize.ts


/**
 * Normalize command line arguments.
 * @param args Command line arguments e.g: `Deno.args`
 */
export function normalize(args: string[]) {
  const normalized = [];
  let inLiteral = false;

  for (const arg of args) {
    if (inLiteral) {
      normalized.push(arg);
    } else if (arg === "--") {
      inLiteral = true;
      normalized.push(arg);
    } else if (arg.length > 1 && arg[0] === "-") {
      const isLong = arg[1] === "-";
      const isDotted = !isLong && arg[2] === ".";

      if (arg.includes("=")) {
        const parts = arg.split("=");
        const flag = parts.shift() as string;

        if (isLong) {
          normalized.push(flag);
        } else {
          normalizeShortFlags(flag);
        }
        normalized.push(parts.join("="));
      } else if (isLong || isDotted) {
        normalized.push(arg);
      } else {
        normalizeShortFlags(arg);
      }
    } else {
      normalized.push(arg);
    }
  }

  return normalized;

  /**
   * Normalize short flags.
   * @param flag Flag string: `-abc`
   */
  function normalizeShortFlags(flag: string): void {
    const flags = flag.slice(1).split("");

    if (isNaN(Number(flag[flag.length - 1]))) {
      flags.forEach((val) => normalized.push(`-${val}`));
    } else {
      normalized.push(`-${flags.shift()}`);
      normalized.push(flags.join(""));
    }
  }
}
