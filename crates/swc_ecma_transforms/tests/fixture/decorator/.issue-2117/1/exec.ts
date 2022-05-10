class TestClass2 {
    @deco public testProperty?: string;
}

function deco(target: any, key: string) {
    console.log(target, key);
}

const instance = new TestClass2();
expect(instance.hasOwnProperty("testProperty")).toBe(true);
