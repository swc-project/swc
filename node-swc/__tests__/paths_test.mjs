import swc from "../..";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

it("should respect paths", async () => {
    const { code } = await swc.transform(`
    import foo from '@src/app';
    console.log(foo)
    `, {
        jsc: {
            parser: {
                syntax: 'typescript',
            },
            target: 'es2021',
            transform: {

            },
            baseUrl: __dirname,
            paths: {
                '@src/*': ['bar/*']
            }
        },
        module: {
            type: 'commonjs'
        },
    });

    expect(code).toContain(`bar/app`);
})
