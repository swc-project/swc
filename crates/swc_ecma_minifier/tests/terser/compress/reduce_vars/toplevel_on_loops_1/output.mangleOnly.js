function l() {
    console.log("bar:", --o);
}
var o = 3;
do {
    l();
}while (o)
