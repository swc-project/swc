const os = require("os");
const cpuCount = os.cpus().length;

const SOURCE = `
'use strict';

class Foo {
  foo() {}
}

class Bar extends Foo {
  foo() {
    super.foo();
  }
  async bar() {}
}

class Baz extends Bar {
  foo() {
    super.foo();
    this.baz()
  }
  baz() {

  }
  async other() {
    this.baz()
    await super.bar()
  }
}

/**
 * Extract red color out of a color integer:
 *
 * 0x00DEAD -> 0x00
 *
 * @param  {Number} color
 * @return {Number}
 */
function red( color )
{
    let foo = 3.14;
    return color >> 16;
}

/**
 * Extract green out of a color integer:
 *
 * 0x00DEAD -> 0xDE
 *
 * @param  {Number} color
 * @return {Number}
 */
function green( color )
{
    return ( color >> 8 ) & 0xFF;
}

/**
 * Extract blue color out of a color integer:
 *
 * 0x00DEAD -> 0xAD
 *
 * @param  {Number} color
 * @return {Number}
 */
function blue( color )
{
    return color & 0xFF;
}

/**
 * Converts an integer containing a color such as 0x00DEAD to a hex
 * string, such as '#00DEAD';
 *
 * @param  {Number} int
 * @return {String}
 */
function intToHex( int )
{
    const mask = '#000000';

    const hex = int.toString( 16 );

    return mask.substring( 0, 7 - hex.length ) + hex;
}

/**
 * Converts a hex string containing a color such as '#00DEAD' to
 * an integer, such as 0x00DEAD;
 *
 * @param  {Number} num
 * @return {String}
 */
function hexToInt( hex )
{
    return parseInt( hex.substring( 1 ), 16 );
}

// fixer
({}) ? 1 : 2;
(foo ?
  // foo
  1 :
  // bar
  ( // baz
    2
  )
) ? 3 : 4;
_iteratorNormalCompletion = (_step = _iterator.next()).done

module.exports = {
    red,
    green,
    blue,
    intToHex,
    hexToInt,
};
`;

const PARSERS = [
  [
    "swc (es3)",
    "../",
    module =>
      module.transform(SOURCE, {
        jsc: { target: "es3" }
      })
  ],
  [
    "swc (es2015)",
    "../",
    module =>
      module.transform(SOURCE, {
        jsc: { target: "es2015" }
      })
  ],
  [
    "swc (es2016)",
    "../",
    module =>
      module.transform(SOURCE, {
        jsc: { target: "es2016" }
      })
  ],
  [
    "swc (es2017)",
    "../",
    module =>
      module.transform(SOURCE, {
        jsc: { target: "es2017" }
      })
  ],
  [
    "swc (es2018)",
    "../",
    module =>
      module.transform(SOURCE, {
        jsc: { target: "es2018" }
      })
  ],
  [
    "swc-optimize (es3)",
    "../",
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
