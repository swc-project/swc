import * as swcHelpers from "@swc/helpers";
// @target: es5
// @lib: es5,es2015.promise
// @module: commonjs
// @filename: task.ts
export class Task extends Promise {
}
class Test {
    example() {
        return swcHelpers.asyncToGenerator(function*() {
            return;
        })();
    }
}
