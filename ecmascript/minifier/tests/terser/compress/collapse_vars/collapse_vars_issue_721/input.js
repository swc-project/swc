define(["require", "exports", "handlebars"], function (require, exports, hb) {
    var win = window;
    var _hb = (win.Handlebars = hb);
    return _hb;
});
def(function (hb) {
    var win = window;
    var prop = "Handlebars";
    var _hb = (win[prop] = hb);
    return _hb;
});
def(function (hb) {
    var prop = "Handlebars";
    var win = window;
    var _hb = (win[prop] = hb);
    return _hb;
});
def(function (hb) {
    var prop = "Handlebars";
    var win = g();
    var _hb = (win[prop] = hb);
    return _hb;
});
def(function (hb) {
    var prop = g1();
    var win = g2();
    var _hb = (win[prop] = hb);
    return _hb;
});
def(function (hb) {
    var win = g2();
    var prop = g1();
    var _hb = (win[prop] = hb);
    return _hb;
});
