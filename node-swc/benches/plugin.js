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

module.exports = {
    red,
    green,
    blue,
    intToHex,
    hexToInt,
};
`;

const swc = require("../");
const Visitor = require("../Visitor").default;

const TESTS = [
  ["parse", () => swc.parseSync(SOURCE)],
  ["parse + print", () => swc.printSync(swc.parseSync(SOURCE))],
  ["parse + transform", () => swc.transformSync(swc.parseSync(SOURCE))],
  [
    "plugin",
    () =>
      swc.transformSync(SOURCE, {
        plugin: m => new Visitor().visitModule(m)
      })
  ]
];

suite("plugin", () => {
  TESTS.map(args => {
    const [name, fn] = args;
    bench(name, fn);
  });
});
