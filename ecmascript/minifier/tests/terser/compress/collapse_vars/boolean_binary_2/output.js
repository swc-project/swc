var c = 0;
c += 1;
((
    function () {
        c = 1 + c;
    } || 9
).toString());
console.log(c);
