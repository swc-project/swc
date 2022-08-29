//// [contextualThisType.ts]
var x = {
    a: function(p) {
        return p;
    }
};
x.a(x);
