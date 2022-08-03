var n = [
    1,
    2,
    function(n) {
        return n * n;
    },
    function(n) {
        return n * n * n;
    }, 
];
console.log(n[0], n[1], n[2](2), n[3]);
