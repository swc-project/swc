class Class1 { }

function isClass2(node) {
    return node instanceof Class2;
}

Class1.isClass2 = isClass2;
export class Class2 extends Class1 {
    constructor() {
        super();
        this.method1 = async () => {
            let var1;
            const function1 = () => { };

            var1 = await Class2.method2();
            await function1()
                .then(() => {
                    console.log(var1);
                })
                .catch();
        };
    }

    static async method2() { }
}