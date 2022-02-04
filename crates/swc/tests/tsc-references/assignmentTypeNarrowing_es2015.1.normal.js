let x;
x = "";
x; // string
[x] = [
    true
];
x; // boolean
[x = ""] = [
    1
];
x; // string | number
({ x  } = {
    x: true
});
x; // boolean
({ y: x  } = {
    y: 1
});
x; // number
({ x =""  } = {
    x: true
});
x; // string | boolean
({ y: x = /a/  } = {
    y: 1
});
x; // number | RegExp
let a;
for (x of a){
    x; // string
}
const arr = [
    {
        x: "ok"
    }
]; // weak type
arr.push({
    x: "ok"
});
