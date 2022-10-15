let o = {
    f () {
        assert.ok(this !== o);
    }
};
(o.f)``;
