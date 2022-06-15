var a;
var b = "test";
var c = false;
var d;
if (c) {
    console.log("unreachable");
    var e;
    function f() {}
}
if (b === "test") {
    var g = "good";
    var h = "beef";
    var i = "bad";
    if (h === "pork") {
        console.log("also unreachable");
    } else if (i === "good") {
        console.log("reached, not const");
    }
}
