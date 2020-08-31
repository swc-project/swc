const fs = require("fs");
const path = require("path");
const Benchmark = require('benchmark').Benchmark;
const Suite = require('benchmark').Suite;

const SOURCE = fs.readFileSync(path.join(__dirname, '..', 'assets', 'AjaxObservable.ts'), 'utf-8');


const PARSERS = [
  [
    "swc (es3)",
    '@swc/core',
    module =>
      module.transformSync(SOURCE, {
        jsc: { target: "es3" }
      })
  ],
  [
    "swc (es2015)",
    '@swc/core',
    module =>
      module.transformSync(SOURCE, {
        jsc: { target: "es2015" }
      })
  ],
  [
    "swc (es2016)",
    '@swc/core',
    module =>
      module.transformSync(SOURCE, {
        jsc: { target: "es2016" }
      })
  ],
  [
    "swc (es2017)",
    '@swc/core',
    module =>
      module.transformSync(SOURCE, {
        jsc: { target: "es2017" }
      })
  ],
  [
    "swc (es2018)",
    '@swc/core',
    module =>
      module.transformSync(SOURCE, {
        jsc: { target: "es2018" }
      })
  ],
  [
    "swc-optimize (es3)",
    '@swc/core',
    module =>
      module.transformSync(SOURCE, {
        jsc: {
          transform: {
            optimizer: {}
          }
        }
      })
  ],
  [
    "babel (es5)",
    "@babel/core",
    module =>
      module.transformSync(SOURCE, {
        presets: ["@babel/preset-env", "@babel/preset-react"],
        // This does less work than swc's InlineGlobals pass, but it's ok.
        // swc is faster than babel anyway.
        plugins: [
          "transform-node-env-inline",
          "@babel/plugin-proposal-class-properties",
          "@babel/proposal-object-rest-spread",
          [
            "@babel/plugin-proposal-decorators",
            { decoratorsBeforeExport: true }
          ]
        ]
      })
  ]
];


const transformSuite = new Suite('Transform rxjs/AjaxObservable.ts benchmark')

PARSERS.map(args => {
  const [name, requirePath, fn] = args;
  try {
    const func = fn.bind(null, require(requirePath));
    transformSuite.add(name, () => {
      bench(name, func);
    })
  } catch (e) {
    console.log(`Cannot load ${requirePath}: ${e.message}`);
  }
});

suite("transform", () => {
  PARSERS.map(args => {
    const [name, requirePath, fn] = args;
    try {
      const func = fn.bind(null, require(requirePath));
      bench(name, func);
    } catch (e) {
      console.log(`Cannot load ${requirePath}: ${e.message}`);
    }
  });
});
