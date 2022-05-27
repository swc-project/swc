var a = [
    1,
    2,
    function() {
        return ++a[0];
    }, 
];
console.log(a[0], a[1], a[2](), a[0]);
