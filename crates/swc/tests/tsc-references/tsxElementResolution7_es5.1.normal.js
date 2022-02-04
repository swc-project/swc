var my;
(function(my1) {
    var div;
    my1.div = div;
})(my || (my = {}));
// OK
/*#__PURE__*/ React.createElement(my.div, {
    n: "x"
});
// Error
/*#__PURE__*/ React.createElement(my.other, null);
var q;
(function(q) {
    var mine = my;
    // OK
    /*#__PURE__*/ React.createElement(mine.div, {
        n: "x"
    });
    // Error
    /*#__PURE__*/ React.createElement(mine.non, null);
})(q || (q = {}));
