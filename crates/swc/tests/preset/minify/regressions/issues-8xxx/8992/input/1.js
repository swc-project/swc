const myObj = {
    get foo() {
        return () => this;
    },
};

const fn = myObj.foo;

// should be true
console.log(fn() === myObj);