var e;
var o = "test";
var a = false;
var r;
if (a) {
    console.log("unreachable");
    var l;
    function n() {}
}
if (o === "test") {
    var s = "good";
    var c = "beef";
    var v = "bad";
    if (c === "pork") {
        console.log("also unreachable");
    } else if (v === "good") {
        console.log("reached, not const");
    }
}
