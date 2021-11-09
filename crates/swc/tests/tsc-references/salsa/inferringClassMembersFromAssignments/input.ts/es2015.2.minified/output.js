class C {
    method() {
        Math.random() ? (this.inMethod = 0, this.inMethodNullable = null) : (this.inMethod = "string", this.inMethodNullable = void 0), this.inMultiple = "string", this.inMultipleMethods = "string", ()=>{
            Math.random() ? this.inNestedArrowFunction = 0 : this.inNestedArrowFunction = "string";
        };
    }
    get() {
        Math.random() ? this.inGetter = 0 : this.inGetter = "string", this.inMultiple = !1, this.inMultipleMethods = !1;
    }
    set() {
        Math.random() ? this.inSetter = 0 : this.inSetter = "string";
    }
    static method() {
        Math.random() ? this.inStaticMethod = 0 : this.inStaticMethod = "string", ()=>{
            Math.random() ? this.inStaticNestedArrowFunction = 0 : this.inStaticNestedArrowFunction = "string";
        };
    }
    static get() {
        Math.random() ? this.inStaticGetter = 0 : this.inStaticGetter = "string";
    }
    static set() {
        Math.random() ? this.inStaticSetter = 0 : this.inStaticSetter = "string";
    }
    constructor(){
        this.prop = ()=>{
            Math.random() ? this.inPropertyDeclaration = 0 : this.inPropertyDeclaration = "string";
        }, Math.random() ? this.inConstructor = 0 : this.inConstructor = "string", this.inMultiple = 0;
    }
}
C.prop = ()=>{
    Math.random() ? this.inStaticPropertyDeclaration = 0 : this.inStaticPropertyDeclaration = "string";
};
var c = new C();
c.inConstructor, c.inMethod, c.inGetter, c.inSetter, c.inPropertyDeclaration, c.inNestedArrowFunction, c.inMultiple, c.inMultipleMethods, c.inMethodNullable;
