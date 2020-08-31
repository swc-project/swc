const fs = require("fs");
const path = require("path");

const os = require("os");
const cpuCount = os.cpus().length;

const SOURCE = fs.readFileSync(path.join(__dirname, '..', 'assets', 'AjaxObservable.ts'), 'utf-8');

const PARSERS = [
  [
    "swc (es3)",
    '@swc/core',
    module =>
      module.transform(SOURCE, {
        jsc: { target: "es3" }
      })
  ],
  [
    "swc (es2015)",
    '@swc/core',
    module =>
      module.transform(SOURCE, {
        jsc: { target: "es2015" }
      })
  ],
  [
    "swc (es2016)",
    '@swc/core',
    module =>
      module.transform(SOURCE, {
        jsc: { target: "es2016" }
      })
  ],
  [
    "swc (es2017)",
    '@swc/core',
    module =>
      module.transform(SOURCE, {
        jsc: { target: "es2017" }
      })
  ],
  [
    "swc (es2018)",
    '@swc/core',
    module =>
      module.transform(SOURCE, {
        jsc: { target: "es2018" }
      })
  ],
  [
    "swc-optimize (es3)",
    '@swc/core',
    module =>
      module.transform(SOURCE, {
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
      module.transform(SOURCE, {
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

const arr = [];
for (let i = 0; i < cpuCount / 2; i++) {
  arr.push(0);
}
console.info(`CPU Core: ${cpuCount}; Parallelism: ${arr.length}`);
console.info(
  `Note that output of this benchmark should be multiplied by ${arr.length} as this test uses Promise.all`
);

suite("multicore", () => {
  PARSERS.map(args => {
    const [name, requirePath, fn] = args;
    const func = fn.bind(null, require(requirePath));
    bench(name, async done => {
      await Promise.all(arr.map(v => func()));
      done();
    });
  });
});
