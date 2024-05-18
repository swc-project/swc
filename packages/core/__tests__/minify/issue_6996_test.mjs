import swc from "../..";

it("should not throw when keep_fnames is on", async () => {
    async function transform() {
        const { code } = await swc.transform('function Foo() {}', {
            jsc: {
                minify: {
                    keep_fnames: true,
                },
            },
        });
        return code;
    }
    // should not reject with unknown field `keep_fnames`
    await expect(transform()).resolves.toEqual('function Foo() {}\n');
});

it("should pass on keep_fnames to minify.{mangle,compress}", async () => {
    const { code } = await swc.transform('export default function Foo() {}', {
        jsc: {
            minify: {
                compress: {},
                mangle: {},
                keep_fnames: true,
            },
        },
        minify: true,
    });
    expect(code).toEqual('export default function Foo(){}');
});

it("should pass on keep_classnames to minify.{mangle,compress}", async () => {
    const { code } = await swc.transform('export default class Foo {}', {
        jsc: {
            minify: {
                compress: {},
                mangle: {},
                keep_classnames: true,
            },
            target: 'esnext',
        },
        minify: true,
    });
    expect(code).toEqual('export default class Foo{}');
});
