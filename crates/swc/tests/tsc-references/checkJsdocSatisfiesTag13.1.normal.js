//// [checkJsdocSatisfiesTag13.ts]
//// [/a.js]
/** @satisfies {{ f: (x: string) => string }} */ var t1 = {
    f: function f(s) {
        return s.toLowerCase();
    }
}; // should work
/** @satisfies {{ f: (x: string) => string }} */ var t2 = {
    g: "oops"
}; // should error
