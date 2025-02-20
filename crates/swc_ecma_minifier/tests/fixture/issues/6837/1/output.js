class Class1 {
}
Class1.isClass2 = function(node) {
    return node instanceof Class2;
};
export class Class2 extends Class1 {
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
