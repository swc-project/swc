class a {
    set() {
        class b {
            set [b](c) {}
        }
    }
}
class b {
    constructor() {
        b();
    }
}
class c {
    [c] = 42;
}
