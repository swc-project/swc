var a = [
    1,
    2,
    function(a) {
        return a * a;
    },
    function(a) {
        return a * a * a;
    }, 
];
console.log(a[0], a[1], a[2](2), a[3]);
