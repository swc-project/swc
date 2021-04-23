class Base {
    method1() { }
    method2() { }
}

class Test extends Base {
    public override async method1() {
        return Promise.resolve(1);
    }

    public async override method2() {
        return Promise.resolve(1);
    }
}