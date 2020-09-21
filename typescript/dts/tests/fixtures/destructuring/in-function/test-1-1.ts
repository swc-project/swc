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

type T1 = ([a, b, c]);
type F1 = ([a, b, c]) => void;

