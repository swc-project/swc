//// [contextualThisType.ts]
var x = {
    a: function(p) {
        return p;
    }
}, y = x.a(x);
