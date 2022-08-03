function o() {
    console.log("bar:", --i);
}
var i = 3;
do {
    o();
}while (i)
