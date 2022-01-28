var arr = [
    1,
    2,
    function () {
        return ++this[0];
    },
];
console.log(1, 2, arr[2], 1);
