import {
  Plugin,
  ParseOptions,
  Module,
  Output,
  Options,
  Script,
  Program,
} from "./types";
export * from "./types";
import { BundleInput, compileBundleOptions } from "./spack";
import { loadBinding } from "@node-rs/helper";

const bindings = loadBinding(__dirname, "swc", "@swc/core")

/**
 * Version of the swc binding.
 */
export const version = require("./package.json").version;

export function plugins(ps: Plugin[]): Plugin {
  return mod => {
    let m = mod;
    for (const p of ps) {
      m = p(m);
    }
    return m;
  };
}

export class Compiler {
  parse(
    src: string,
    options: ParseOptions & { isModule: false }
  ): Promise<Script>;
  parse(src: string, options?: ParseOptions): Promise<Module>;
  async parse(src: string, options?: ParseOptions): Promise<Program> {
    options = options || { syntax: "ecmascript" };
    options.syntax = options.syntax || "ecmascript";

    const res = await bindings.parse(src, toBuffer(options));
    return JSON.parse(res);
  }

  parseSync(src: string, options: ParseOptions & { isModule: false }): Script;
  parseSync(src: string, options?: ParseOptions): Module;
  parseSync(src: string, options?: ParseOptions): Program {
    options = options || { syntax: "ecmascript" };
    options.syntax = options.syntax || "ecmascript";

    return JSON.parse(bindings.parseSync(src, toBuffer(options)));
  }

  parseFile(
    path: string,
    options: ParseOptions & { isModule: false }
  ): Promise<Script>;
  parseFile(path: string, options?: ParseOptions): Promise<Module>;
  parseFile(path: string, options?: ParseOptions): Promise<Program> {
    options = options || { syntax: "ecmascript" };
    options.syntax = options.syntax || "ecmascript";

    const res = bindings.parseFile(path, toBuffer(options));

    return JSON.parse(res);
  }

  parseFileSync(
    path: string,
    options: ParseOptions & { isModule: false }
  ): Script;
  parseFileSync(path: string, options?: ParseOptions): Module;
  parseFileSync(path: string, options?: ParseOptions): Program {
    options = options || { syntax: "ecmascript" };
    options.syntax = options.syntax || "ecmascript";

    return JSON.parse(bindings.parseFileSync(path, toBuffer(options)));
  }

  /**
   * Note: this method should be invoked on the compiler instance used
   *  for `parse()` / `parseSync()`.
   */
  async print(m: Program, options?: Options): Promise<Output> {
    options = options || {};

    return bindings.print(JSON.stringify(m), toBuffer(options))
  }

  /**
   * Note: this method should be invoked on the compiler instance used
   *  for `parse()` / `parseSync()`.
   */
  printSync(m: Program, options?: Options): Output {
    options = options || {};

    return bindings.printSync(JSON.stringify(m), toBuffer(options));
  }

  async transform(src: string | Program, options?: Options): Promise<Output> {
    const isModule = typeof src !== "string";
    options = options || {};

    if (options?.jsc?.parser) {
      options.jsc.parser.syntax = options.jsc.parser.syntax ?? 'ecmascript';
    }


    const { plugin, ...newOptions } = options;

    if (plugin) {
      const m =
        typeof src === "string"
          ? await this.parse(src, options?.jsc?.parser)
          : src;
      return this.transform(plugin(m), newOptions);
    }

    return bindings.transform(isModule ? JSON.stringify(src) : src, isModule, toBuffer(newOptions))
  }

  transformSync(src: string | Program, options?: Options): Output {
    const isModule = typeof src !== "string";
    options = options || {};

    if (options?.jsc?.parser) {
      options.jsc.parser.syntax = options.jsc.parser.syntax ?? 'ecmascript';
    }


    const { plugin, ...newOptions } = options;

    if (plugin) {
      const m =
        typeof src === "string" ? this.parseSync(src, options?.jsc?.parser) : src;
      return this.transformSync(plugin(m), newOptions);
    }

    return bindings.transformSync(
      isModule ? JSON.stringify(src) : src,
      isModule,
      toBuffer(newOptions),
    )
  }

  async transformFile(path: string, options?: Options): Promise<Output> {
    options = options || {};

    if (options?.jsc?.parser) {
      options.jsc.parser.syntax = options.jsc.parser.syntax ?? 'ecmascript';
    }


    const { plugin, ...newOptions } = options;

    if (plugin) {
      const m = await this.parseFile(path, options?.jsc?.parser);
      return this.transform(plugin(m), newOptions);
    }

    return bindings.transformFile(path, false, toBuffer(newOptions))
  }

  transformFileSync(path: string, options?: Options): Output {
    options = options || {};

    if (options?.jsc?.parser) {
      options.jsc.parser.syntax = options.jsc.parser.syntax ?? 'ecmascript';
    }


    const { plugin, ...newOptions } = options;

    if (plugin) {
      const m = this.parseFileSync(path, options?.jsc?.parser);
      return this.transformSync(plugin(m), newOptions);
    }

    return bindings.transformFileSync(path, /* isModule */ false, toBuffer(newOptions));
  }


  async bundle(options?: BundleInput | string): Promise<{ [name: string]: Output }> {
    const opts = await compileBundleOptions(options);

    if (Array.isArray(opts)) {
      const all = await Promise.all(opts.map(async (opt) => {
        return this.bundle(opt)
      }));
      let obj = {} as any;
      for (const o of all) {
        obj = {
          ...obj,
          ...o,
        };
      }
      return obj;
    }

    return bindings.bundle(toBuffer({
      ...opts,
    }));
  }
}

const compiler = new Compiler();

export function parse(
  src: string,
  options: ParseOptions & { isModule: false }
): Promise<Script>;
export function parse(src: string, options?: ParseOptions): Promise<Module>;
export function parse(src: string, options?: ParseOptions): Promise<Program> {
  return compiler.parse(src, options);
}

export function parseSync(
  src: string,
  options: ParseOptions & { isModule: false }
): Script;
export function parseSync(src: string, options?: ParseOptions): Module;
export function parseSync(src: string, options?: ParseOptions): Program {
  return compiler.parseSync(src, options);
}

export function parseFile(
  path: string,
  options: ParseOptions & { isModule: false }
): Promise<Script>;
export function parseFile(
  path: string,
  options?: ParseOptions
): Promise<Module>;
export function parseFile(
  path: string,
  options?: ParseOptions
): Promise<Program> {
  return compiler.parseFile(path, options);
}

export function parseFileSync(
  path: string,
  options: ParseOptions & { isModule: false }
): Script;
export function parseFileSync(path: string, options?: ParseOptions): Module;
export function parseFileSync(path: string, options?: ParseOptions): Program {
  return compiler.parseFileSync(path, options);
}

export function print(m: Program, options?: Options): Promise<Output> {
  return compiler.print(m, options);
}

export function printSync(m: Program, options?: Options): Output {
  return compiler.printSync(m, options);
}

export function transform(
  src: string | Program,
  options?: Options
): Promise<Output> {
  return compiler.transform(src, options);
}

export function transformSync(
  src: string | Program,
  options?: Options
): Output {
  return compiler.transformSync(src, options);
}

export function transformFile(
  path: string,
  options?: Options
): Promise<Output> {
  return compiler.transformFile(path, options);
}

export function transformFileSync(path: string, options?: Options): Output {
  return compiler.transformFileSync(path, options);
}

export function bundle(
  options?: BundleInput | string
): Promise<{ [name: string]: Output }> {
  return compiler.bundle(options)
}

export const DEFAULT_EXTENSIONS = Object.freeze([
  ".js",
  ".jsx",
  ".es6",
  ".es",
  ".mjs",
  ".ts",
  ".tsx"
]);

function toBuffer(t: any): Buffer {
  return Buffer.from(JSON.stringify(t))
}
