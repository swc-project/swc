class ClassA {
    constructor() {
        console.log('Class A');
    }
}

const cls = class ClassB {
    static MyA = ClassA;

    constructor() {
        console.log('Claas B');
    }

    it() {
        console.log('method it - start');

        this.bb = new ClassB.MyA();

        console.log('method it - end');
    }
}


new cls().it();