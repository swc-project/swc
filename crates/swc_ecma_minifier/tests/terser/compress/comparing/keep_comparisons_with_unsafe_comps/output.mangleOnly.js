var r = {
    valueOf: function () {
        triggeredFirst();
    },
};
var a = {
    valueOf: function () {
        triggeredSecond();
    },
};
var v = r <= a;
var e = r < a;
var i = r >= a;
var n = r > a;
