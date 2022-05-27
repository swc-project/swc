var a = function() {
    var a = 7, arguments = 5, b = function() {
        console.log(arguments);
    };
    b(a, 1);
};
a();
