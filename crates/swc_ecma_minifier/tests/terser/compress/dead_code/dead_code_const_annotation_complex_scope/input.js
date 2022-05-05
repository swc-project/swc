var unused_var;
/** @const */ var test = "test";
// @const
var CONST_FOO_ANN = false;
var unused_var_2;
if (CONST_FOO_ANN) {
    console.log("unreachable");
    var moo;
    function bar() {}
}
if (test === "test") {
    var beef = "good";
    /** @const */ var meat = "beef";
    var pork = "bad";
    if (meat === "pork") {
        console.log("also unreachable");
    } else if (pork === "good") {
        console.log("reached, not const");
    }
}
