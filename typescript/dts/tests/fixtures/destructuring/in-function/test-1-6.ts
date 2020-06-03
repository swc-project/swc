// @declaration: true

interface a {
    a
}

interface b {
    b
}

interface c {
    c
}

var v1 = ([a, b, c]) => "hello";
var v2: ([a, b, c]) => string;
