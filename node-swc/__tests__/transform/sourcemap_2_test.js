const swc = require('../../../');

describe('Duplicate filename', () => {
    it('should work correctly', () => {
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
});