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

type T2 = ({ a });
type F2 = ({a}) => void;
