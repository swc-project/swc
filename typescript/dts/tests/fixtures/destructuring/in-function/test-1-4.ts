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

type T4 = ([{ a: [b, c] }]);
type F4 = ([{a: [b, c]}]) => void;
