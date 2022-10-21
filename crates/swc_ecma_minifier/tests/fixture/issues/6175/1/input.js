let o = {
    f() {
        assert.ok(this !== o);
    }
};
(1, o.f)``;
(true ? o.f : false)``;
(true && o.f)``;