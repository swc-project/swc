//// [file.tsx]
(function(my) {})(my || (my = {}));
// OK
<my.div n='x'/>;
// Error
<my.other/>;
(function(q) {
    var mine = my;
    // OK
    <mine.div n='x'/>;
    // Error
    <mine.non/>;
})(q || (q = {}));
var my, q;
