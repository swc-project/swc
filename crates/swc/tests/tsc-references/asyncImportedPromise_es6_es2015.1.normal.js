import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
// @target: es6
// @module: commonjs
// @filename: task.ts
export class Task extends Promise {
}
class Test {
    example() {
        return _async_to_generator(function*() {
            return;
        })();
    }
}
