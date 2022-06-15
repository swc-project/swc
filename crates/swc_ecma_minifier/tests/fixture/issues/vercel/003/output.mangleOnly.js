import { a, b } from "./utils";
if (typeof window !== "undefined") {
    require("intersection-observer");
}
const c = (function c() {
    const e = new Map();
    function f(a) {
        return g(a) || new IntersectionObserver(k, a);
    }
    function g(c = {}) {
        const f = b(c);
        for (const g of e.keys()){
            if (a(g, f)) {
                return g;
            }
        }
        return null;
    }
    function h(a) {
        return !e.has(a) ? e.set(a, new Map()).get(a) : e.get(a);
    }
    function i(a, b, c) {
        const e = h(a);
        e.set(b, c);
        a.observe(b);
    }
    function j(a, b) {
        const c = h(a);
        c.delete(b);
        a.unobserve(b);
    }
    function k(a, b) {
        for (let c of a){
            const e = h(b);
            const f = e.get(c.target);
            if (f) {
                f(c);
            }
        }
    }
    return {
        d: f,
        l: i,
        q: j
    };
})();
export default c;
export const { d  } = c;
export const { l  } = c;
export const { q  } = c;
