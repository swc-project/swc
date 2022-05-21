class TestClass {
    @foo
    abc() { }
}

function foo(target: unknown, propertyKey: string | symbol) {
    console.log(`Decorating ${target}.${String(propertyKey)}`)
}