
export class Node {
    foo() {
        this.#bar(this);
    }

    #bar(parent) {
        parent.#baz(this);
        parent.baz.#baz(this);
    }

    #baz(child) { }
}
