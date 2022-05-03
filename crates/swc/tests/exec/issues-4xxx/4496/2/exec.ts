

let id = 1;

function dec() {
    console.log(id)
    return id++
}


@dec
class Foo {
    @dec
    prop1: number

    @dec
    [dec()]: number

    @dec
    @dec
    [dec()]: number

    @dec
    prop2: number
}