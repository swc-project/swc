const swc = require("../../..");
const path = require('path');


it('should handle multiple entry in spack.config.js', async () => {
    const result = await swc.bundle(path.join(__dirname, '../../tests/spack/config/spack.config.js'));

    expect(result.a).toBeTruthy();
    expect(result.a.code.replace('\n', '')).toBe(`console.log('foo');`);

    expect(result.b).toBeTruthy();
    expect(result.b.code.replace('\n', '')).toBe(`console.log('bar');`);
});

it('should respect .swcrc', async () => {
    const result = await swc.bundle(path.join(__dirname, '../../tests/spack/config-swcrc/spack.config.js'));

    expect(result.a).toBeTruthy();
    expect(result.a.code).toContain(`require("./common-`);

    expect(result.b).toBeTruthy();
    expect(result.b.code).toContain(`require("./common-`);
});