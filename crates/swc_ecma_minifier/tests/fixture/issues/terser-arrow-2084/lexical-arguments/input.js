(function (c) {
    c++;
    var c = 0;
    console.log(c, arguments[0], (() => arguments[0])());
})(3);
