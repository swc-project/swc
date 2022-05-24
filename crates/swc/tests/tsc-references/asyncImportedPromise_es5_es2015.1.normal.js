import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
// @target: es5
// @lib: es5,es2015.promise
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
