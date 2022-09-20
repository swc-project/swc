//// [typeArgumentInference.ts]
function noParams() {}
noParams();
noParams();
noParams();
function noGenericParams(n) {}
noGenericParams("");
noGenericParams("");
noGenericParams("");
function someGenerics1(n, m) {}
someGenerics1(3, 4);
someGenerics1(3, 4);
function someGenerics2a(n) {}
someGenerics2a(function(n) {
    return n;
});
someGenerics2a(function(n) {
    return n;
});
someGenerics2a(function(n) {
    return n.substr(0);
});
function someGenerics2b(n) {}
someGenerics2b(function(n, x) {
    return n;
});
someGenerics2b(function(n, t) {
    return n;
});
someGenerics2b(function(n, t) {
    return n.substr(t * t);
});
function someGenerics3(producer) {}
someGenerics3(function() {
    return "";
});
someGenerics3(function() {});
someGenerics3(function() {
    return 3;
});
function someGenerics4(n, f) {}
someGenerics4(4, function() {
    return null;
});
someGenerics4("", function() {
    return 3;
});
someGenerics4(null, null);
function someGenerics5(n, f) {}
someGenerics5(4, function() {
    return null;
});
someGenerics5("", function() {
    return 3;
});
someGenerics5(null, null);
function someGenerics6(a, b, c) {}
someGenerics6(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
});
someGenerics6(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
});
someGenerics6(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
});
function someGenerics7(a, b, c) {}
someGenerics7(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
});
someGenerics7(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
});
someGenerics7(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
});
someGenerics7(null, null, null);
