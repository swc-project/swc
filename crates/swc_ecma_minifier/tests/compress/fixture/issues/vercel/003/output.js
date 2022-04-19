import { a, b } from './utils';
'undefined' != typeof window && require('intersection-observer');
let manager = function() {
    let c = new Map();
    function j(k) {
        return c.has(k) ? c.get(k) : c.set(k, new Map()).get(k);
    }
    function g1(u, v) {
        for (let w of u){
            let x = j(v), y = x.get(w.target);
            y && y(w);
        }
    }
    return {
        d: function(e) {
            return function(g = {}) {
                let h = b(g);
                for (let i of c.keys())if (a(i, h)) return i;
                return null;
            }(e) || new IntersectionObserver(g1, e);
        },
        l: function(m, n, o) {
            let p = j(m);
            p.set(n, o), m.observe(n);
        },
        q: function(r, s) {
            let t = j(r);
            t.delete(s), r.unobserve(s);
        }
    };
}();
export default manager;
export const { d  } = manager;
export const { l  } = manager;
export const { q  } = manager;
