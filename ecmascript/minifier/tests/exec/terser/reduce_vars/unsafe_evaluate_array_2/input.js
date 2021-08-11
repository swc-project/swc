var arr = [
    1,
    2,
    function (x) {
        return x * x;
    },
    function (x) {
        return x * x * x;
    },
];
console.log(arr[0], arr[1], arr[2](2), arr[3]);
