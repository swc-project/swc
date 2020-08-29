const swc = require("../../..");
const path = require('path');
const os = require('os');


it('should handle multiple entries on same level', async () => {
    const result = await swc.bundle({
        entry: {
            a: path.join(__dirname, '../../tests/spack/mutli-entry-same-level/src/a.js'),
            b: path.join(__dirname, '../../tests/spack/mutli-entry-same-level/src/b.js'),
        }
    });

    expect(result.a).toBeTruthy();
    expect(result.a.code).toContain(`import { foo } from './common-`);

    expect(result.b).toBeTruthy();
    expect(result.b.code).toContain(`import { foo } from './common-`);
});

if (os.platform() !== 'win32') {
    it('should handle multiple entries on different level', async () => {
        const result = await swc.bundle({
            entry: {
                web: path.join(__dirname, '../../tests/spack/mutli-entry-different-level/src/web/index.js'),
                a: path.join(__dirname, '../../tests/spack/mutli-entry-different-level/src/a.js'),
            }
        });

        expect(result.a).toBeTruthy();
        expect(result.a.code).toContain(`import { foo } from './common-`);

        expect(result.web).toBeTruthy();
        expect(result.web.code).toContain(`../common`);
    });
}