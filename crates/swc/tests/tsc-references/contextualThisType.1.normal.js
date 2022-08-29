//// [contextualThisType.ts]
var x = {
    a: function a(p) {
        return p;
    }
};
var y = x.a(x);
