let x;
let obj;
x = "";
x = x.length;
x; // number
x = true;
(x = "", obj).foo = x = x.length;
x; // number
let o;
if ((o = fn()).done) {
    const y = o.value;
}
