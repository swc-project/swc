let o = {
    f() {
        assert.ok(this !== o);
    }
};
(1, o.f)``;