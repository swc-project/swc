class A {
    constructor(map){
        this.map = map;
    }
}
class C extends A {
    // Ensure 'value' is not of type 'any' by invoking it with type arguments.
    constructor(){
        super((value)=>String(value()));
    }
}
