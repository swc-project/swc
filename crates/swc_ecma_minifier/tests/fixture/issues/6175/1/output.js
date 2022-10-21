let o = {
    f () {
        assert.ok(this !== o);
    }
};
(0, o.f)``, (0, o.f)``, (0, o.f)``, (0, o.f)``;
