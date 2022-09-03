//// [thisTypeSyntacticContext.ts]
function f() {}
var o = {
    n: 1
};
o.test = f, o.test(), o.test(), o.test(), o.test(), o.test(), o.test();
