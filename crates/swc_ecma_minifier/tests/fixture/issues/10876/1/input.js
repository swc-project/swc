const createCounter1 = () => {
    let count = 0;
    return (numToAdd) => {
        count += numToAdd;
        return count;
    };
};

const createCounter2 = () => {
    let count = 0;
    return (numToAdd) => {
        count += numToAdd;
        return count;
    };
};

function createCounter3() {
    let count = 0;
    return (numToAdd) => {
        count += numToAdd;
        return count;
    };
}

class Counter {
    add = createCounter1();

    static {
        this.helper = createCounter2();
    }

    static method() {
        return createCounter3();
    }
}

const counter1 = new Counter();
const counter2 = new Counter();

console.log(counter1.add(1));
console.log(counter2.add(1));
console.log(Counter.helper(1));
console.log(Counter.method()(1));

export {};
