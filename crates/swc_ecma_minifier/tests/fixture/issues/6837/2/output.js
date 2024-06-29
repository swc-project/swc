class Class2 extends Class1 {
    constructor(){
        this.method1 = async ()=>{
            let var1;
            var1 = await Class2.method2();
            await (()=>{})().then(()=>{
                console.log(var1);
            });
        };
    }
    static async method2() {}
}
export { Class2 };
