var my, q;
!function(my1) {
    var div;
    my1.div = div;
}(my || (my = {})), React.createElement(my.div, {
    n: "x"
}), React.createElement(my.other, null), function(q) {
    var mine = my;
    React.createElement(mine.div, {
        n: "x"
    }), React.createElement(mine.non, null);
}(q || (q = {}));
