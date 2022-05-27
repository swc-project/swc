var a = {
    valueOf: function() {
        triggeredFirst();
    }
};
var b = {
    valueOf: function() {
        triggeredSecond();
    }
};
var c = a <= b;
var d = a < b;
var e = a >= b;
var f = a > b;
