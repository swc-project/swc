var obj_foo = 1;
var obj_bar = 2;
function f() {
    var obj = { foo: 3, bar: 4, "b-r": 5, "b+r": 6, "b!r": 7 };
    console.log(obj_foo, obj.foo, obj.bar, obj["b-r"], obj["b+r"], obj["b!r"]);
}
f();
