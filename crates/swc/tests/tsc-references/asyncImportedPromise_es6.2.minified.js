//// [task.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "Task", {
    enumerable: !0,
    get: ()=>Task
});
class Task extends Promise {
}
//// [test.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default;
class Test {
    example() {
        return _asyncToGenerator(function*() {})();
    }
}
