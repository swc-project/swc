let o = {
    f () {
        assert.ok(this !== o);
    }
};
o.f``, (!0 && o.f)``, (!0 && o.f)``, (0, o.f)``;
