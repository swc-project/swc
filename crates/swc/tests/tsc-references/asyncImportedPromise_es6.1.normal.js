//// [task.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Task", {
    enumerable: true,
    get: ()=>Task
});
class Task extends Promise {
}
//// [test.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default;
class Test {
    example() {
        return _asyncToGenerator(function*() {
            return;
        })();
    }
}
