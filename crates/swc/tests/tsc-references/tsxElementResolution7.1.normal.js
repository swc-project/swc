//// [file.tsx]
(function(my) {})(my || (my = {}));
// OK
/*#__PURE__*/ React.createElement(my.div, {
    n: "x"
});
// Error
/*#__PURE__*/ React.createElement(my.other, null);
(function(q) {
    var mine = my;
    // OK
    /*#__PURE__*/ React.createElement(mine.div, {
        n: "x"
    });
    // Error
    /*#__PURE__*/ React.createElement(mine.non, null);
})(q || (q = {}));
var my, q;
