var n = function () {
    var n = 7,
        arguments = 5,
        o = function () {
            console.log(arguments);
        };
    o(n, 1);
};
n();
