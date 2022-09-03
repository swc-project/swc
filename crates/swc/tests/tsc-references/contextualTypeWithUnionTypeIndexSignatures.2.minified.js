//// [contextualTypeWithUnionTypeIndexSignatures.ts]
var x = {
    z: function(a) {
        return a;
    }
}, x = {
    foo: function(a) {
        return a;
    }
}, x = {
    foo: "hello"
}, x2 = {
    z: function(a) {
        return a.toString();
    }
}, x2 = {
    z: function(a) {
        return a;
    }
}, x3 = {
    1: function(a) {
        return a;
    }
}, x3 = {
    0: function(a) {
        return a;
    }
}, x3 = {
    0: "hello"
}, x4 = {
    1: function(a) {
        return a.toString();
    }
}, x4 = {
    1: function(a) {
        return a;
    }
};
