// Test for issue #11447: this becomes undefined in arrow functions inside async functions with class inheritance
class BaseClass {
    addHandler(fn) {
        fn();
    }
}

class DerivedClass extends BaseClass {
    constructor() {
        super();

        this.addHandler(() => {
            const asyncFn = async () => {
                const items = await this.getItems();

                // Previously `this` was undefined here in 1.15.4
                const found = items.find((item) => this.matches(item));
                console.log(found);
            };
            asyncFn();
        });
    }

    async getItems() {
        return ["a", "b", "c"];
    }

    matches(item) {
        return item === "b";
    }
}

new DerivedClass();
