//// [importAssertion1.ts]
//// [0.ts]
export const a = 1;
export const b = 2;
//// [1.ts]
import './0';
import { a, b } from './0';
import * as foo from './0';
foo.a, foo.b;
//// [2.ts]
import { a, b } from './0';
import { a as c, b as d } from './0';
//// [3.ts]
import('./0'), import('./0', {
    assert: {
        type: "json"
    }
}), import('./0', {
    assert: {
        type: "json",
        ttype: "typo"
    }
}), import('./0', {
    assert: {}
}), import('./0', {}), import('./0', foo()), import(), import('./0', {}, {}), import('./0', {
    assert: {
        type: "json"
    }
});
