class TestCls {
    foo() {
        this.#bar();
        this.#switch();
    }
    #switch() {
        console.log("#switch called");
    }

    #bar() {
        console.log("#bar called");
    }
}

let a = new TestCls();
a.foo();
