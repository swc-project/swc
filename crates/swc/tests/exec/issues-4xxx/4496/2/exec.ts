

let id = 1;

function dec() {
    console.log(id)
    return () => id++
}

function key() {
    console.log(id)
    return id++
}


@dec
class Foo {
    @dec
    prop1: number

    @dec
    [key()]: number

    @dec
    @dec
    [key()]: number

    @dec
    prop2: number
}

