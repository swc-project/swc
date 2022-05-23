class A {
    constructor(map){
        this.map = map;
    }
}
class B extends A {
    // Ensure 'value' is of type 'number (and not '{}') by using its 'toExponential()' method.
    constructor(){
        super((value)=>String(value.toExponential()));
    }
}
