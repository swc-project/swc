export var fn = function() {
    var varA;
    return objCreator({
        varA: condCheck ? // a bad comment
        "a" : "b"
    });
};
