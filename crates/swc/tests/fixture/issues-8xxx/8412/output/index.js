export var fn = function() {
    var varA;
    return(// a bad comment
    varA = condCheck ? "a" : "b", objCreator({
        varA: varA
    }));
};
