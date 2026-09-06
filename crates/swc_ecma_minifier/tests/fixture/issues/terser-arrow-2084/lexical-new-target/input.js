new (function (c) {
    c++;
    var c = 0;
    console.log(!!new.target, (() => !!new.target)(), c);
})(3);
