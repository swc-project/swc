const SOURCE = `
'use strict';

class Foo {
  foo(): void {}
}

class Bar extends Foo {
  foo(): void {
    super.foo();
  }
  async bar() {}
}

class Baz extends Bar {
  foo(): void {
    super.foo();
    this.baz()
  }
  baz(): void {

  }
  async other() : Promise<void> {
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
function red( color: number )
{
    let foo: number = 3.14;
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
function green( color: number )
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
function blue( color: number )
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
function intToHex( int: number )
{
    const mask = '#000000';

    const hex = int.toString( 16 );

    return mask.substring( 0, 7 - hex.length ) + hex;
}

/**
 * Converts a hex string containing a color such as '#00DEAD' to
 * an integer, such as 0x00DEAD;
 *
 * @param  {String} hex
 * @return {Number}
 */
function hexToInt( hex: string )
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



const PARSERS = [
  ['swc (es3)', '../', (module) => module.transformSync(SOURCE, {
    jsc: {
      target: 'es3',
      parser: {
        syntax: "typescript",
      },
    }
  })],
  ['swc (es5)', '../', (module) => module.transformSync(SOURCE, {
    jsc: {
      target: 'es5',
      parser: {
        syntax: "typescript",
      },
    }
  })],
  ['swc (es2015)', '../', (module) => module.transformSync(SOURCE, {
    jsc: {
      target: 'es2015',
      parser: {
        syntax: "typescript",
      },
    }
  })],
  ['swc (es2016)', '../', (module) => module.transformSync(SOURCE, {
    jsc: {
      target: 'es2016',
      parser: {
        syntax: "typescript",
      },
    }
  })],
  ['swc (es2017)', '../', (module) => module.transformSync(SOURCE, {
    jsc: {
      target: 'es2017',
      parser: {
        syntax: "typescript",
      },
    }
  })],
  ['swc (es2018)', '../', (module) => module.transformSync(SOURCE, {
    jsc: {
      target: 'es2018',
      parser: {
        syntax: "typescript",
      },
    }
  })],
  ['swc-optimize (es3)', '../', (module) => module.transformSync(SOURCE, {
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
