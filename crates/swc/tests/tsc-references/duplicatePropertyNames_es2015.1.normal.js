// duplicate property names are an error in all types
class C {
    bar(x) {}
    bar(x) {}
    constructor(){
        this.baz = ()=>{};
        this.baz = ()=>{};
    }
}
var a;
var b = {
    foo: '',
    foo: '',
    bar: ()=>{},
    bar: ()=>{}
};
