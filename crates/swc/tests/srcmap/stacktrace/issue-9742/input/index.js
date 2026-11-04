class Parent {
    constructor() {
        throw new Error('foo')
    }
}

class Child extends Parent {
    handleScroll = () => { }
}

new Child()