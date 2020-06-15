const swc = require("../../..");
const path = require('path');


it('should handle multiple entries on same level', async () => {
    const result = await swc.bundle({
        entry: {
            a: path.join(__dirname, '../../tests/spack/mutli-entry-same-level/src/a.js'),
            b: path.join(__dirname, '../../tests/spack/mutli-entry-same-level/src/b.js'),
        }
    });

    console.log(Object.keys(result))

    expect(result.a).toBeTruthy();
    expect(result.a.code.replace('\n', '')).toBe(`console.log('foo');`);

    expect(result.b).toBeTruthy();
    expect(result.b.code.replace('\n', '')).toBe(`console.log('bar');`);
});


it('should handle multiple entries on different level', async () => {
    const result = await swc.bundle({
        entry: {
            web: path.join(__dirname, '../../tests/spack/mutli-entry-different-level/src/web/index.js'),
            a: path.join(__dirname, '../../tests/spack/mutli-entry-different-level/src/a.js'),
        }
    });

    console.log(Object.keys(result))

    expect(result.a).toBeTruthy();
    expect(result.a.code.replace('\n', '')).toBe(`console.log('foo');`);

    expect(result.b).toBeTruthy();
    expect(result.b.code.replace('\n', '')).toBe(`console.log('bar');`);
});