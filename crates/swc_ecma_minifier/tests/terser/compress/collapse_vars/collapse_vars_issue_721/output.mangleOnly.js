define([
    "require",
    "exports",
    "handlebars"
], function(d, e, a) {
    var b = window;
    var c = (b.Handlebars = a);
    return c;
});
def(function(a) {
    var b = window;
    var c = "Handlebars";
    var d = (b[c] = a);
    return d;
});
def(function(a) {
    var b = "Handlebars";
    var c = window;
    var d = (c[b] = a);
    return d;
});
def(function(a) {
    var b = "Handlebars";
    var c = g();
    var d = (c[b] = a);
    return d;
});
def(function(a) {
    var b = g1();
    var c = g2();
    var d = (c[b] = a);
    return d;
});
def(function(a) {
    var b = g2();
    var c = g1();
    var d = (b[c] = a);
    return d;
});
