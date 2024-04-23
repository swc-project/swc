//// [typeArgumentInferenceConstructSignatures.ts]
var noParams, noGenericParams, someGenerics1, someGenerics2a, someGenerics2b, someGenerics3, someGenerics4, someGenerics5, someGenerics6, someGenerics7, someGenerics9, anyVar;
new noParams(), new noParams(), new noParams(), new noGenericParams(''), new noGenericParams(''), new noGenericParams(''), new someGenerics1(3, 4), new someGenerics1(3, 4), new someGenerics1(3, 4), new someGenerics2a(function(n) {
    return n;
}), new someGenerics2a(function(n) {
    return n;
}), new someGenerics2a(function(n) {
    return n.substr(0);
}), new someGenerics2b(function(n, x) {
    return n;
}), new someGenerics2b(function(n, t) {
    return n;
}), new someGenerics2b(function(n, t) {
    return n.substr(t * t);
}), new someGenerics3(function() {
    return '';
}), new someGenerics3(function() {}), new someGenerics3(function() {
    return 3;
}), new someGenerics4(4, function() {
    return null;
}), new someGenerics4('', function() {
    return 3;
}), new someGenerics4('', function(x) {
    return '';
}), new someGenerics4(null, null), new someGenerics5(4, function() {
    return null;
}), new someGenerics5('', function() {
    return 3;
}), new someGenerics5('', function(x) {
    return '';
}), new someGenerics5(null, null), new someGenerics6(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
}), new someGenerics6(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
}), new someGenerics6(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
}), new someGenerics6(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
}), new someGenerics7(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
}), new someGenerics7(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
}), new someGenerics7(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
}), new new (void 0)(someGenerics7)(null, null, null), new someGenerics9('', 0, []), new someGenerics9({
    a: 0
}, {
    b: ''
}, null), new someGenerics9(void 0, {
    x: 6,
    z: window
}, {
    x: 6,
    y: ''
}), new someGenerics9(void 0, {
    x: 6,
    z: window
}, {
    x: 6,
    y: ''
}), new someGenerics9({
    x: 3
}, {
    x: 6
}, {
    x: 6
}), new someGenerics9(7, anyVar, 4), new someGenerics9([], null, void 0);
