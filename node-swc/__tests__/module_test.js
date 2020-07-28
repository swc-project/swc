const swc = require("../../");

it("should emit _interopRequireDefault", () => {
    const out = swc.transformSync(`import foo from "foo"`, {
        module: {
            type: "commonjs"
        }
    });
    expect(out.map).toBeFalsy();

    expect(out.code).toContain(`function _interopRequireDefault`);
    expect(out.code).toContain(
        `var _foo = _interopRequireDefault(require("foo"))`
    );
});

it("should emit _interopRequireWildcard", () => {
    const out = swc.transformSync('import * as foo from "foo"', {
        module: {
            type: "commonjs"
        }
    });
    expect(out.map).toBeFalsy();

    expect(out.code).toContain(`function _interopRequireWildcard`);
    expect(out.code).toContain(
        `var foo = _interopRequireWildcard(require("foo"))`
    );
});

it("should work with amd and expternal helpers", () => {
    const out = swc.transformSync(
        `class Foo {}
    class Bar extends Foo {}`,
        {
            jsc: {
                externalHelpers: true
            },
            module: {
                type: "amd",
                moduleId: "a"
            }
        }
    );

    expect(out.map).toBeFalsy();

    expect(out.code).toContain(`define("a",`);
    expect(out.code).toContain(`swcHelpers.classCallCheck(this, Foo);`);
    expect(out.code).toContain(`swcHelpers.inherits(Bar, Foo);`);
});
