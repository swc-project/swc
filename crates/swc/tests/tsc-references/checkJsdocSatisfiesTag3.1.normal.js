//// [checkJsdocSatisfiesTag3.ts]
//// [/a.js]
/** @type {{ f(s: string): void } & Record<string, unknown> }} */ var obj = /** @satisfies {{ g(s: string): void } & Record<string, unknown>} */ {
    f: function f(s) {},
    g: function g(s) {}
};
// This needs to not crash (outer node is not expression)
/** @satisfies {{ f(s: string): void }} */ ({
    f: function f(x) {}
});
