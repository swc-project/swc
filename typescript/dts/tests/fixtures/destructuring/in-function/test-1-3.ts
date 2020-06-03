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

type T3 = ([{ a: b }, { b: a }]);
type F3 = ([{a: b}, {b: a}]) => void;
