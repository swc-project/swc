export function test() {
    // try putting this in stmts instead of at the top level
    @decorate()
    class Foo {

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

    return new Foo();
}