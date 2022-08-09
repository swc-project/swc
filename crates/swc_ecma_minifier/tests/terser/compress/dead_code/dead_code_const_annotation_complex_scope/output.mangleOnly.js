var a;
var r = "test";
var v = false;
var f;
if (v) {
    console.log("unreachable");
    var i;
    function l() {}
}
if (r === "test") {
    var o = "good";
    var e = "beef";
    var g = "bad";
    if (e === "pork") {
        console.log("also unreachable");
    } else if (g === "good") {
        console.log("reached, not const");
    }
}
