import { a as t, b as n } from "./utils";
if (typeof window !== "undefined") {
    require("intersection-observer");
}
const o = (function o() {
    const e = new Map();
    function r(t) {
        return c(t) || new IntersectionObserver(i, t);
    }
    function c(o = {}) {
        const r = n(o);
        for (const c of e.keys()){
            if (t(c, r)) {
                return c;
            }
        }
        return null;
    }
    function f(t) {
        return !e.has(t) ? e.set(t, new Map()).get(t) : e.get(t);
    }
    function s(t, n, o) {
        const e = f(t);
        e.set(n, o);
        t.observe(n);
    }
    function u(t, n) {
        const o = f(t);
        o.delete(n);
        t.unobserve(n);
    }
    function i(t, n) {
        for (let o of t){
            const e = f(n);
            const r = e.get(o.target);
            if (r) {
                r(o);
            }
        }
    }
    return {
        d: r,
        l: s,
        q: u
    };
})();
export default o;
export const { d  } = o;
export const { l  } = o;
export const { q  } = o;
