@decorate()
export class Foo {

    @decorate()
    get name() {
        return "hello"
    }

    @decorate()
    sayHi() {
        return "hello"
    }
}

function decorate() {
    return function (target, { kind }) {
        console.log(target, kind)
    }
}