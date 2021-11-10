var arr = [
    1,
    2,
    function () {
        return ++arr[0];
    },
];
console.log(arr[0], arr[1], arr[2](), arr[0]);
