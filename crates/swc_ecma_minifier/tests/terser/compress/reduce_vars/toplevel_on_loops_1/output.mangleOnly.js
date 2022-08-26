function o() {
    console.log("bar:", --a);
}
var a = 3;
do {
    o();
}while (a)
