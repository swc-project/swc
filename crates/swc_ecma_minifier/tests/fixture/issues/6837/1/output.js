function isClass2(node) {
    return node instanceof Class2;
}
Class1.isClass2 = isClass2;
class Class2 extends Class1 {
    constructor(){
        super();
        this.method1 = async ()=>{
            let var1;
            var1 = await Class2.method2();
            await (()=>{})().then(()=>{
                console.log(var1);
            }).catch();
        };
    }
    static async method2() {}
}
class Class1 {
}
export { Class2 };
