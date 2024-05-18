const swc = require("../");

it("should emit _interop_require_default", () => {
    const out = swc.transformSync(`import foo from "foo"`, {
        module: {
            type: "commonjs",
        },
    });
    expect(out.map).toBeFalsy();

    expect(out.code).toContain(`function _interop_require_default`);
    expect(out.code).toContain(`_interop_require_default(require("foo"))`);
});

it("should emit _interop_require_wildcard", () => {
    const out = swc.transformSync('import * as foo from "foo"', {
        module: {
            type: "commonjs",
        },
    });
    expect(out.map).toBeFalsy();

    expect(out.code).toContain(`function _interop_require_wildcard`);
    expect(out.code).toContain(`_interop_require_wildcard(require("foo"))`);
});

it("should work with amd and external helpers", () => {
    const out = swc.transformSync(
        `class Foo {}
    class Bar extends Foo {}`,
        {
            jsc: {
                externalHelpers: true,
            },
            module: {
                type: "amd",
                moduleId: "a",
            },
        }
    );

    expect(out.map).toBeFalsy();

    expect(out.code).toContain(`define("a",`);
    expect(out.code).toContain(`_class_call_check._(this, Foo);`);
    expect(out.code).toContain(`_inherits._(Bar, Foo);`);
});

it("should not require filename if no exports in umd", () => {
    const code = `console.log('test')`;

    const out = swc.transformSync(code, {
        jsc: {
            parser: {
                syntax: "ecmascript",
            },
        },
        module: {
            type: "umd",
        },
        isModule: true,
    });
    expect(out.code).toContain(`function(global`);
});
