class Test {
    constructor(name) {
        this.name = name;
    }

    print = async (arg) => {
        console.log(this.name, arg);
    };
}

function Parent() {
    new Test("name").print("test");
}

Parent();
