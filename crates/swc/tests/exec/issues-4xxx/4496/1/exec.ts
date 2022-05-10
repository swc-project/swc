let id = 1;

function dec() {
    console.log(id);
    return () => id++;
}

@dec
class Foo {
    @dec
    prop: number;
    @dec
    @dec
    propWithInit = 2;
}
