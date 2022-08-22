class A {
    #a = 123n;
    foo() {
        this.#a++;
        console.log(this.#a);
    }
}

new A().foo();
