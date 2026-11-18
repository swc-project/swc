function f() {
    ({ a: class {
        static {
            do {
                (function () {});
                break;
            } while (false);
        }
    } });
    "use strict";
    return this === undefined;
}
console.log(f());
