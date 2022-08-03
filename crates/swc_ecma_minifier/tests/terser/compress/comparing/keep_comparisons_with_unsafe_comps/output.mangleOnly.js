var a = {
    valueOf: function() {
        triggeredFirst();
    }
};
var v = {
    valueOf: function() {
        triggeredSecond();
    }
};
var r = a <= v;
var f = a < v;
var n = a >= v;
var u = a > v;
