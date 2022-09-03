//// [YieldExpression10_es6.ts]
var v = {
    *foo () {
        yield foo;
    }
};
