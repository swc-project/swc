var outer = function () {
    var k = 7,
        arguments = 5,
        inner = function () {
            console.log(arguments);
        };
    inner(k, 1);
};
outer();
