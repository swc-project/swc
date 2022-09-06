var o = 0;
o += 1;
((
    function () {
        o = 1 + o;
    } || 9
).toString());
console.log(o);
