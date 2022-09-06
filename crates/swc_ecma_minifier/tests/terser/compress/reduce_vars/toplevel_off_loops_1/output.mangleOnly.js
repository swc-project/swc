function o() {
    console.log("bar:", --l);
}
var l = 3;
do {
    o();
} while (l);
