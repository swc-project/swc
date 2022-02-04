var r = new class {
    fn() {
        return this;
    }
}().fn();
r[1], r.a;
