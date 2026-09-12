(function (c) {
    console.log(typeof c, c());
    function c() { return 3; }
    var c = 7;
    console.log(c);
})(1);
