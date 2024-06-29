var fn = function() {
    return objCreator({
        varA: condCheck ? // a bad comment
        "a" : "b"
    });
};
export { fn };
