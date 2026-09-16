!(function () {
    let read = () => c;
    !(function (c) {
        c++;
        var c = 0;
        console.log(read(), c);
    })(-1);
    var c = 2;
})();
