class A {
    test() {
        return 1;
    }
}
export class B extends A {
    constructor(){
        super();
        let fn = ()=>super.test();
        setTimeout(function() {
            fn();
        }, 0);
    }
}
