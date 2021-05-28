function f() {
    return x + y;
}
let x, y;
let a = (z) => {
    x = "A";
    y = z;
    console.log(f());
};
a(1);
a(2);
