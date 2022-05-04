export function a() {
    alert("a");
    c++;
}

export var c = 5;

function b() {
    a();
}

b();

function foo(c) {
    alert("a");
    c++;
}
