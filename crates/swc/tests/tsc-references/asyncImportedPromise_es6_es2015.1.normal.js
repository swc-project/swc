// @target: es6
// @module: commonjs
// @filename: task.ts
export class Task extends Promise {
}
// @filename: test.ts
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
class Test {
    example() {
        return _async_to_generator(function*() {
            return;
        })();
    }
}
export { };
