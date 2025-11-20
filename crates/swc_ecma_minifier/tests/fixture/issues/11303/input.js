class X {
    constructor() {

    }
}

class Y extends X {

}

const t = (a) => (b => {
    if (a.foo()) throw Error();
    return a;
}), y = t(new Y);
