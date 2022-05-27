var e;
var a = "test";
var b = false;
var f;
if (b) {
    console.log("unreachable");
    var g;
    function h() {}
}
if (a === "test") {
    var i = "good";
    var c = "beef";
    var d = "bad";
    if (c === "pork") {
        console.log("also unreachable");
    } else if (d === "good") {
        console.log("reached, not const");
    }
}
