const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var res = _ts_add_disposable_resource(env, {
        [Symbol.dispose] () {
            console.log(value, all);
        }
    }, false);
    namespace N {
        export function next() {
            return 42;
        }
    }
    var value = N.next();
    enum E {
        A = 1
    }
    enum E {
        B = 2
    }
    var C = class C {
    };
    namespace C {
        export const x = 3;
    }
    var all = [
        E.A,
        E.B,
        C.x
    ];
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
import type { Payload } from "./types";
export { N };
export { value };
export { E };
export { C };
export function f() {}
export namespace f {
    export const y = 4;
}
export declare const ambient: number;
export { all };
export default Payload;
