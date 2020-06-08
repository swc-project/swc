const swc = require("../../../");
const path = require('path');


it('should handle a simple case', async () => {
    const result = await swc.bundle({
        name: 'simple',
        entry: path.join(__dirname, '../../tests/spack/simple/a.js'),
    });

    console.log(result)
    expect(result.simple).toBeTruthy();
    expect(result.simple.code.replace('\n','')).toBe(`console.log('Foo');`);
});