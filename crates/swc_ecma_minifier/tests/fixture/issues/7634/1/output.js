import o from './foo.js';
const t = o;
import './foo.js';
const r = function o(t) {
    return t.map(o);
};
export { t as Bar, r as default };
