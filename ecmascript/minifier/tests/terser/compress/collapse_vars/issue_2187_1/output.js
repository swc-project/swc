var a = 1;
!(function (foo) {
    foo();
    var a = 2;
    console.log(a);
})(function () {
    console.log(a);
});
