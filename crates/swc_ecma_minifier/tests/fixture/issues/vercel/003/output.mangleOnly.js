import { a as b, b as c } from "./utils";
if (typeof window !== "undefined") {
    require("intersection-observer");
}
const a = (function g() {
    const h = new Map();
    function a(a) {
        return i(a) || new IntersectionObserver(k, a);
    }
    function i(e = {}) {
        const f = c(e);
        for (const a of h.keys()){
            if (b(a, f)) {
                return a;
            }
        }
        return null;
    }
    function j(a) {
        return !h.has(a) ? h.set(a, new Map()).get(a) : h.get(a);
    }
    function e(a, b, c) {
        const e = j(a);
        e.set(b, c);
        a.observe(b);
    }
    function f(a, b) {
        const c = j(a);
        c.delete(b);
        a.unobserve(b);
    }
    function k(c, e) {
        for (let a of c){
            const f = j(e);
            const b = f.get(a.target);
            if (b) {
                b(a);
            }
        }
    }
    return {
        d: a,
        l: e,
        q: f
    };
})();
export default a;
export const { d  } = a;
export const { l  } = a;
export const { q  } = a;
