//// [importAssertion1.ts]
//// [0.ts]
export const a = 1;
export const b = 2;
//// [1.ts]
import './0';
import { a, b } from './0';
import * as foo from './0';
a;
b;
foo.a;
foo.b;
//// [2.ts]
import { a, b } from './0';
import { a as c, b as d } from './0';
a;
b;
c;
d;
//// [3.ts]
const a = import('./0');
const b = import('./0', {
    assert: {
        type: "json"
    }
});
const c = import('./0', {
    assert: {
        type: "json",
        ttype: "typo"
    }
});
const d = import('./0', {
    assert: {}
});
const dd = import('./0', {});
const e = import('./0', foo());
const f = import();
const g = import('./0', {}, {});
const h = import('./0', {
    assert: {
        type: "json"
    }
});
