const {
    x,
    y,
    z,
} = a;

function f1() {}

// No error here
const { o } = foo;
function f2() {}

// error here
switch (v) {
    case 1:
    case 2:
}
f1();

// but no error here
switch (v) {}
f1();

var i = 10;

var j = 10;
