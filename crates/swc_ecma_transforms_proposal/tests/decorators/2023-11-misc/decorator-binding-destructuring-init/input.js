function init() {}

const { dec } = (x = init(), {
  dec: init,
});

@dec
class C {}
