function f() {
    ({
        a: class {
            static{
                do {
                    (function() {});
                    break;
                }while (false)
            }
        }
    });
    "use strict";
    return void 0 === this;
}
console.log(f());
