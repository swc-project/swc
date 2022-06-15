import { a, b } from "./utils";
if (typeof window !== "undefined") {
    require("intersection-observer");
}
const c = (function c() {
    const d = new Map();
    function e(a) {
        return f(a) || new IntersectionObserver(j, a);
    }
    function f(c = {}) {
        const e = b(c);
        for (const f of d.keys()){
            if (a(f, e)) {
                return f;
            }
        }
        return null;
    }
    function g(a) {
        return !d.has(a) ? d.set(a, new Map()).get(a) : d.get(a);
    }
    function h(a, b, c) {
        const d = g(a);
        d.set(b, c);
        a.observe(b);
    }
    function i(a, b) {
        const c = g(a);
        c.delete(b);
        a.unobserve(b);
    }
    function j(a, b) {
        for (let c of a){
            const d = g(b);
            const e = d.get(c.target);
            if (e) {
                e(c);
            }
        }
    }
    return {
        d: e,
        l: h,
        q: i
    };
})();
export default c;
export const { d  } = c;
export const { l  } = c;
export const { q  } = c;
