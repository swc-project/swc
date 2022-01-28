import { a, b } from './utils';

if (typeof window !== 'undefined') {
    require('intersection-observer');
}

const manager = (function makeManager() {
    const c = new Map();

    function d(e) {
        return (
            f(e) ||
            new IntersectionObserver(g, e)
        );
    }

    function f(g = {}) {
        const h = b(g);
        for (const i of c.keys()) {
            if (a(i, h)) {
                return i;
            }
        }
        return null;
    }

    function j(k) {
        return !c.has(k)
            ? c.set(k, new Map()).get(k)
            : c.get(k);
    }

    function l(m, n, o) {
        const p = j(m);
        p.set(n, o);
        m.observe(n);
    }

    function q(r, s) {
        const t = j(r);
        t.delete(s);
        r.unobserve(s);
    }

    function g(u, v) {
        for (let w of u) {
            const x = j(v);
            const y = x.get(w.target);
            if (y) {
                y(w);
            }
        }
    }

    return {
        d,
        l,
        q,
    };
})();

export default manager;
export const { d } = manager;
export const { l } = manager;
export const { q } = manager;
