var my1;
(function(my) {
    var div;
    my.div = div;
})(my1 || (my1 = {
}));
// OK
/*#__PURE__*/ React.createElement(my1.div, {
    n: "x"
});
// Error
/*#__PURE__*/ React.createElement(my1.other, null);
var q;
(function(q) {
    var mine = my1;
    // OK
    /*#__PURE__*/ React.createElement(mine.div, {
        n: "x"
    });
    // Error
    /*#__PURE__*/ React.createElement(mine.non, null);
})(q || (q = {
}));
