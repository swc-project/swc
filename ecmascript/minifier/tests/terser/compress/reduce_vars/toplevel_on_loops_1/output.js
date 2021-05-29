function bar() {
    console.log("bar:", --x);
}
var x = 3;
do bar();
while (x);
