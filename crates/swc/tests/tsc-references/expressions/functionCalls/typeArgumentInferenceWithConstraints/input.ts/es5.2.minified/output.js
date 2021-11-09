var anyVar;
function noParams() {
}
function noGenericParams(n) {
}
function someGenerics1(n, m) {
}
function someGenerics2a(n) {
}
function someGenerics2b(n) {
}
function someGenerics3(producer) {
}
function someGenerics4(n, f) {
}
function someGenerics5(n, f) {
}
function someGenerics6(a, b, c) {
}
function someGenerics7(a, b, c) {
}
function someGenerics9(a, b, c) {
    return null;
}
noParams(), noParams(), noParams(), noGenericParams(""), noGenericParams(""), noGenericParams(""), someGenerics1(3, 4), someGenerics1(3, 4), someGenerics1(3, 4), someGenerics1(3, 4), someGenerics2a(function(n) {
    return n;
}), someGenerics2a(function(n) {
    return n;
}), someGenerics2a(function(n) {
    return n.substr(0);
}), someGenerics2b(function(n, x) {
    return n;
}), someGenerics2b(function(n, t) {
    return n;
}), someGenerics2b(function(n, t) {
    return n.substr(t * t);
}), someGenerics3(function() {
    return "";
}), someGenerics3(function() {
}), someGenerics3(function() {
    return 3;
}), someGenerics4(4, function() {
    return null;
}), someGenerics4("", function() {
    return 3;
}), someGenerics4("", function(x) {
    return "";
}), someGenerics4(null, null), someGenerics5(4, function() {
    return null;
}), someGenerics5("", function() {
    return 3;
}), someGenerics5("", function(x) {
    return "";
}), someGenerics5(null, null), someGenerics6(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
}), someGenerics6(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
}), someGenerics6(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
}), someGenerics6(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
}), someGenerics7(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
}), someGenerics7(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
}), someGenerics7(function(n) {
    return n;
}, function(n) {
    return n;
}, function(n) {
    return n;
}), someGenerics7(null, null, null), someGenerics9("", 0, []), someGenerics9({
    a: 0
}, {
    b: ""
}, null), someGenerics9(void 0, {
    x: 6,
    z: window
}, {
    x: 6,
    y: ""
}), someGenerics9(void 0, {
    x: 6,
    z: window
}, {
    x: 6,
    y: ""
}), someGenerics9({
    x: 3
}, {
    x: 6
}, {
    x: 6
}), someGenerics9(7, anyVar, 4), someGenerics9([], null, void 0);
