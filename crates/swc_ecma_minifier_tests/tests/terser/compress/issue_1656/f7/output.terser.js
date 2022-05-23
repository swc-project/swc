var b = 10;

!(function () {
    b = 100;
})(),
    console.log(100, b);
