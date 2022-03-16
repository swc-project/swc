const swc = require("../../../");
const path = require('path');

it('dummy', () => {
    const { transformSync } = swc;

    const input = `
    export * from './createColors'
    export * from './createColorsFromMap'
    export * from './interfaces'
    export * from './rgbHex'
    export * from './rgbaString'
    `;

    let option = {
        sourceMaps: true,
        filename: 'C:\\github\\color-map\\ts\\index.ts',
    }
    const pass = transformSync(input, option);
    const fail = transformSync(input, {
        ...option,
        module: { type: 'commonjs' },
    });

    expect(JSON.parse(pass.map)).toEqual(JSON.parse(fail.map));
});


it('should handle a simple case', async () => {
    const result = await swc.bundle({
        name: 'simple',
        entry: {
            simple: path.join(__dirname, '../../tests/spack/simple/a.js')
        },
    });

    console.log(result)
    expect(result.simple).toBeTruthy();
    expect(result.simple.code.replace('\n', '')).toBe(`console.log('Foo');`);
});

it('should handle loader', async () => {
    const result = await swc.bundle({
        name: 'virtual',
        entry: {
            simple: path.join(__dirname, '../../tests/spack/simple/a.js')
        },
        module: {
            rules: {
                loaders: [
                    {
                        test: 'virtual',
                    }
                ]
            }
        }
    });

    console.log(result)
    expect(result.simple).toBeTruthy();
    expect(result.simple.code.replace('\n', '')).toBe(`console.log('Foo');`);
});