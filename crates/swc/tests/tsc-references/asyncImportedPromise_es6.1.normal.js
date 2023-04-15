//// [task.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Task", {
    enumerable: true,
    get: function() {
        return Task;
    }
});
class Task extends Promise {
}
//// [test.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _async_to_generator = require("@swc/helpers/_/_async_to_generator");
class Test {
    example() {
        return _async_to_generator._(function*() {
            return;
        })();
    }
}
