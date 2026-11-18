//// [classWithStaticFieldInParameterInitializer.2.ts]
class C {
}
((b = class extends C {
    static{
        this.x = 1;
    }
})=>{})();
((b = class extends C {
    static{
        this.x = 1;
    }
})=>{})();
