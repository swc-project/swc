define([
    "require",
    "exports",
    "handlebars"
], function(r, a, n) {
    var v = window;
    var e = (v.Handlebars = n);
    return e;
});
def(function(r) {
    var a = window;
    var n = "Handlebars";
    var v = (a[n] = r);
    return v;
});
def(function(r) {
    var a = "Handlebars";
    var n = window;
    var v = (n[a] = r);
    return v;
});
def(function(r) {
    var a = "Handlebars";
    var n = g();
    var v = (n[a] = r);
    return v;
});
def(function(r) {
    var a = g1();
    var n = g2();
    var v = (n[a] = r);
    return v;
});
def(function(r) {
    var a = g2();
    var n = g1();
    var v = (a[n] = r);
    return v;
});
