var a;
var e = "test";
var o = false;
var r;
if (o) {
    console.log("unreachable");
    var l;
    function v() {}
}
if (e === "test") {
    var f = "good";
    var t = "beef";
    var n = "bad";
    if (t === "pork") {
        console.log("also unreachable");
    } else if (n === "good") {
        console.log("reached, not const");
    }
}
