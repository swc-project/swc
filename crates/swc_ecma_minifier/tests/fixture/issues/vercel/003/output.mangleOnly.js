import { a as t, b as n } from "./utils";
if (typeof window !== "undefined") {
    require("intersection-observer");
}
const e = (function e() {
    const o = new Map();
    function r(t) {
        return s(t) || new IntersectionObserver(u, t);
    }
    function s(e = {}) {
        const r = n(e);
        for (const s of o.keys()){
            if (t(s, r)) {
                return s;
            }
        }
        return null;
    }
    function c(t) {
        return !o.has(t) ? o.set(t, new Map()).get(t) : o.get(t);
    }
    function f(t, n, e) {
        const o = c(t);
        o.set(n, e);
        t.observe(n);
    }
    function i(t, n) {
        const e = c(t);
        e.delete(n);
        t.unobserve(n);
    }
    function u(t, n) {
        for (let e of t){
            const o = c(n);
            const r = o.get(e.target);
            if (r) {
                r(e);
            }
        }
    }
    return {
        d: r,
        l: f,
        q: i
    };
})();
export default e;
export const { d  } = e;
export const { l  } = e;
export const { q  } = e;
