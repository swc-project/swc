import * as swcHelpers from "@swc/helpers";
// @target: es6
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
