//// [arrayLiteralWithMultipleBestCommonTypes.ts]
var a, b, c, as = [
    a,
    b
], bs = [
    b,
    a
], cs = [
    a,
    b,
    c
], ds = [
    function(x) {
        return 1;
    },
    function(x) {
        return 2;
    }
], es = [
    function(x) {
        return 2;
    },
    function(x) {
        return 1;
    }
], fs = [
    function(a) {
        return 1;
    },
    function(b) {
        return 2;
    }
], gs = [
    function(b) {
        return 2;
    },
    function(a) {
        return 1;
    }
];
