console.log(function () {
    var o = {
        p: 7
    };
    console.log([
        o
    ][0].p++);
    return o.p;
}());