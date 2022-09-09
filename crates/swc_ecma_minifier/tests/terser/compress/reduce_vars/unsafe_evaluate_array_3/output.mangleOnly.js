var n = [
    1,
    2,
    function () {
        return ++n[0];
    },
];
console.log(n[0], n[1], n[2](), n[0]);
