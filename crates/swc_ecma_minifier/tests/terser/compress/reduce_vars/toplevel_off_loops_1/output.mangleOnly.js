function a() {
    console.log("bar:", --b);
}
var b = 3;
do {
    a();
}while (b)
