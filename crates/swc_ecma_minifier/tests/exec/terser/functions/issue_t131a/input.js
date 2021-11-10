(function () {
    function thing() {
        return { a: 1 };
    }
    function one() {
        return thing();
    }
    function two() {
        var x = thing();
        x.a = 2;
        x.b = 3;
        return x;
    }
    console.log(JSON.stringify(one()), JSON.stringify(two()));
})();
