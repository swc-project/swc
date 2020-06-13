const swc = require("../../..");
const path = require('path');


it('should handle multiple entry in spack.config.js', async () => {
    const result = await swc.bundle('');

    console.log(result)
    expect(result.a).toBeTruthy();
    expect(result.a.code.replace('\n', '')).toBe(`console.log('Foo');`);
});