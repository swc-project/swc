class Foo { }

class Bar extends Foo {
    constructor() {
        super();
        this.node = 1;
        const self = this;
        this.root = {
            get node() {
                return self.node;
            }
        };
    }
}

console.log((new Bar()).root.node);