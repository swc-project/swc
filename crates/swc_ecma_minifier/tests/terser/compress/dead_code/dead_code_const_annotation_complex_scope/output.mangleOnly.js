var o;
var a = "test";
var e = false;
var r;
if (e) {
    console.log("unreachable");
    var l;
    function n() {}
}
if (a === "test") {
    var s = "good";
    var c = "beef";
    var v = "bad";
    if (c === "pork") {
        console.log("also unreachable");
    } else if (v === "good") {
        console.log("reached, not const");
    }
}
