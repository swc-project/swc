import swc from "../../..";
import { dirname, join } from "path";
import { platform } from "os";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

it("should work", async () => {
    const dir = path.join(__dirname,
        "..",
        "..",
        "tests",
        "issue-4730",
    );
    const filename = join(
        dir,
        "src",
        "index.ts"
    );
    console.log(filename);
    const { code } = await swc.transformFile(filename, {
        jsc: {
            parser: {
                syntax: "typescript",
                dynamicImport: true,
            },
            target: "es2020",
            paths: {
                "@print/a": [join(dir, "./packages/a/src/index.ts")],
                "@print/b": [join(dir, "./packages/b/src/index.ts")],
            },
        },
        module: {
            type: "commonjs",
        },
    });
    expect(code).toMatchInlineSnapshot(`
"\\"use strict\\";
var _b = require(\\"@print/b\\");
function _getRequireWildcardCache() {
    if (typeof WeakMap !== \\"function\\") return null;
    var cache = new WeakMap();
    _getRequireWildcardCache = function() {
        return cache;
    };
    return cache;
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== \\"object\\" && typeof obj !== \\"function\\") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache();
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function display() {
    const displayA = await Promise.resolve().then(function() {
        return _interopRequireWildcard(require(\\"@print/a\\"));
    }).then((c)=>c.displayA);
    console.log(displayA());
    console.log((0, _b).displayB());
}
display();
"
`);
});
