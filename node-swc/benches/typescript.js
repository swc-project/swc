const fs = require("fs");
const path = require("path");

const SOURCE = fs.readFileSync(path.join(__dirname, '..', 'assets', 'AjaxObservable.ts'), 'utf-8');


const PARSERS = [
  ['swc (es3)', '@swc/core', (module) => module.transformSync(SOURCE, {
    jsc: {
      target: 'es3',
      parser: {
        syntax: "typescript",
      },
    }
  })],
  ['swc (es5)', '@swc/core', (module) => module.transformSync(SOURCE, {
    jsc: {
      target: 'es5',
      parser: {
        syntax: "typescript",
      },
    }
  })],
  ['swc (es2015)', '@swc/core', (module) => module.transformSync(SOURCE, {
    jsc: {
      target: 'es2015',
      parser: {
        syntax: "typescript",
      },
    }
  })],
  ['swc (es2016)', '@swc/core', (module) => module.transformSync(SOURCE, {
    jsc: {
      target: 'es2016',
      parser: {
        syntax: "typescript",
      },
    }
  })],
  ['swc (es2017)', '@swc/core', (module) => module.transformSync(SOURCE, {
    jsc: {
      target: 'es2017',
      parser: {
        syntax: "typescript",
      },
    }
  })],
  ['swc (es2018)', '@swc/core', (module) => module.transformSync(SOURCE, {
    jsc: {
      target: 'es2018',
      parser: {
        syntax: "typescript",
      },
    }
  })],
  ['swc-optimize (es3)', '@swc/core', (module) => module.transformSync(SOURCE, {
    jsc: {
      parser: {
        syntax: "typescript",
      },
      transform: {
        optimizer: {}
      }
    }
  })],
  ['babel (es5)', '@babel/core', (module) => module.transformSync(SOURCE, {
    presets: ["@babel/preset-typescript", "@babel/preset-env"],
    // This does less work than swc's InlineGlobals pass, but it's ok.
    // swc is faster than babel anyway.
    plugins: [
      "transform-node-env-inline",
      "@babel/proposal-class-properties",
      "@babel/proposal-object-rest-spread",
      ["@babel/plugin-proposal-decorators", { decoratorsBeforeExport: true }],
    ],
    filename: 'foo.ts',
  })],
];

suite('typescript', () => {
  PARSERS.map((args) => {
    const [name, requirePath, fn] = args;
    try {
      const func = fn.bind(null, require(requirePath));
      bench(name, func);
    } catch (e) {
      console.log(`Cannot load ${requirePath}: ${e.message}`);
    }
  });
});
