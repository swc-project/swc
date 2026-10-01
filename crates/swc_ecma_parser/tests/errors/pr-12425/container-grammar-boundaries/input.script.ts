async function f() {
    declare module "m" { import type { X } from "n"; }
    let { aw\u0061it = 1 } = obj;
}
function* g() {
    declare module "m" { import type { X } from "n"; }
    let { y\u0069eld = 1 } = obj;
}
class C {
    static {
        declare module "m" { import type { X } from "n"; }
        let { aw\u0061it = 1 } = obj;
    }
}
