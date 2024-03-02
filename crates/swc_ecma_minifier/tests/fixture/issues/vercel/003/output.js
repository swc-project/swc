import { a, b } from "./utils";
"undefined" != typeof window && require("intersection-observer");
const manager = function() {
    const c = new Map();
    function j(k) {
        return c.has(k) ? c.get(k) : c.set(k, new Map()).get(k);
    }
    function g(u, v) {
        for (let w of u){
            const y = j(v).get(w.target);
            y && y(w);
        }
    }
    return {
        d: function(e) {
            return function(g = {}) {
                const h = b(g);
                for (const i of c.keys())if (a(i, h)) return i;
                return null;
            }(e) || new IntersectionObserver(g, e);
        },
        l: function(m, n, o) {
            j(m).set(n, o), m.observe(n);
        },
        q: function(r, s) {
            j(r).delete(s), r.unobserve(s);
        }
    };
}();
export default manager;
export const { d } = manager;
export const { l } = manager;
export const { q } = manager;
