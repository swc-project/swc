class A {
    world = false
}

eval("hello")

class B extends A {
    set hello(v) {
        super.world = v
    }

    get hello() {
        return super.world
    }
}